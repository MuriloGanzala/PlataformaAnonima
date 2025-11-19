from flask import Blueprint, request, jsonify
from src.models.denuncia import db, Denuncia
import random
import string
import json
from datetime import datetime
from flask_socketio import SocketIO



denuncia_bp = Blueprint('denuncia', __name__)

def gerar_protocolo():
    """Gera um protocolo único para a denúncia"""
    ano = datetime.now().year
    codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"DEN-{ano}-{codigo}"

@denuncia_bp.route('/denuncias', methods=['POST'])
def criar_denuncia():

    
    

    """Cria uma nova denúncia anônima"""
    try:
        data = request.json
        
        # Validação básica
        campos_obrigatorios = ['categoria', 'descricao', 'urgencia']
        for campo in campos_obrigatorios:
            if not data.get(campo):
                return jsonify({'erro': f'Campo {campo} é obrigatório'}), 400
        
        # Gera protocolo único
        protocolo = gerar_protocolo()
        while Denuncia.query.filter_by(protocolo=protocolo).first():
            protocolo = gerar_protocolo()
        
        # Cria a denúncia
        nova_denuncia = Denuncia(
            protocolo=protocolo,
            categoria=data['categoria'],
            descricao=data['descricao'],
            local=data.get('local', ''),
            data_incidente=data.get('data_incidente', ''),
            pessoas_envolvidas=data.get('pessoas_envolvidas', ''),
            urgencia=data['urgencia'],
            status='Pendente',
            acoes=json.dumps([])
        )
        
        db.session.add(nova_denuncia)
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Denúncia registrada com sucesso',
            'protocolo': protocolo
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@denuncia_bp.route('/denuncias', methods=['GET'])
def listar_denuncias():
    """Lista todas as denúncias (para admin)"""
    try:
        # Filtros opcionais
        categoria = request.args.get('categoria')
        status = request.args.get('status')
        urgencia = request.args.get('urgencia')
        
        query = Denuncia.query
        
        if categoria:
            query = query.filter_by(categoria=categoria)
        if status:
            query = query.filter_by(status=status)
        if urgencia:
            query = query.filter_by(urgencia=urgencia)
        
        denuncias = query.order_by(Denuncia.data_criacao.desc()).all()
        
        return jsonify([d.to_dict() for d in denuncias]), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@denuncia_bp.route('/denuncias/<protocolo>', methods=['GET'])
def buscar_denuncia(protocolo):
    """Busca uma denúncia pelo protocolo (para acompanhamento anônimo)"""
    try:
        denuncia = Denuncia.query.filter_by(protocolo=protocolo).first()
        
        if not denuncia:
            return jsonify({'erro': 'Denúncia não encontrada'}), 404
        
        return jsonify(denuncia.to_dict()), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@denuncia_bp.route('/denuncias/<int:id>', methods=['PUT'])
def atualizar_denuncia(id):
    """Atualiza status e adiciona ações a uma denúncia (admin)"""
    try:
        denuncia = Denuncia.query.get(id)
        
        if not denuncia:
            return jsonify({'erro': 'Denúncia não encontrada'}), 404
        
        data = request.json
        
        # Atualiza status se fornecido
        if 'status' in data:
            denuncia.status = data['status']
        
        # Adiciona nova ação ao histórico
        if 'nova_acao' in data:
            acoes = json.loads(denuncia.acoes) if denuncia.acoes else []
            acoes.append({
                'data': datetime.now().isoformat(),
                'acao': data['nova_acao']
            })
            denuncia.acoes = json.dumps(acoes)
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Denúncia atualizada com sucesso',
            'denuncia': denuncia.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@denuncia_bp.route('/denuncias/<int:id>', methods=['DELETE'])
def deletar_denuncia(id):
    """Deleta uma denúncia (admin)"""
    try:
        denuncia = Denuncia.query.get(id)
        
        if not denuncia:
            return jsonify({'erro': 'Denúncia não encontrada'}), 404
        
        db.session.delete(denuncia)
        db.session.commit()
        
        return jsonify({'mensagem': 'Denúncia deletada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@denuncia_bp.route('/relatorios', methods=['GET'])
def gerar_relatorio():
    """Gera relatório estatístico das denúncias"""
    try:
        total = Denuncia.query.count()
        
        # Por status
        por_status = db.session.query(
            Denuncia.status, 
            db.func.count(Denuncia.id)
        ).group_by(Denuncia.status).all()
        
        # Por categoria
        por_categoria = db.session.query(
            Denuncia.categoria, 
            db.func.count(Denuncia.id)
        ).group_by(Denuncia.categoria).all()
        
        # Por urgência
        por_urgencia = db.session.query(
            Denuncia.urgencia, 
            db.func.count(Denuncia.id)
        ).group_by(Denuncia.urgencia).all()
        
        relatorio = {
            'total': total,
            'por_status': [{'status': s, 'quantidade': q} for s, q in por_status],
            'por_categoria': [{'categoria': c, 'quantidade': q} for c, q in por_categoria],
            'por_urgencia': [{'urgencia': u, 'quantidade': q} for u, q in por_urgencia]
        }
        
        return jsonify(relatorio), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    



