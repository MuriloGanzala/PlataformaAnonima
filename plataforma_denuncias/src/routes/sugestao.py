from flask import Blueprint, request, jsonify
from src.models.denuncia import db, Sugestao
import random
import string
from datetime import datetime

sugestao_bp = Blueprint('sugestao', __name__)

def gerar_protocolo_sugestao():
    """Gera um protocolo único para a sugestão"""
    ano = datetime.now().year
    codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"SUG-{ano}-{codigo}"

@sugestao_bp.route('/sugestoes', methods=['POST'])
def criar_sugestao():
    """Cria uma nova sugestão anônima"""
    try:
        data = request.json
        
        # Validação básica
        if not data.get('titulo') or not data.get('descricao'):
            return jsonify({'erro': 'Título e descrição são obrigatórios'}), 400
        
        # Gera protocolo único
        protocolo = gerar_protocolo_sugestao()
        while Sugestao.query.filter_by(protocolo=protocolo).first():
            protocolo = gerar_protocolo_sugestao()
        
        # Cria a sugestão
        nova_sugestao = Sugestao(
            protocolo=protocolo,
            titulo=data['titulo'],
            descricao=data['descricao'],
            categoria=data.get('categoria', 'Geral'),
            status='Recebida'
        )
        
        db.session.add(nova_sugestao)
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Sugestão registrada com sucesso',
            'protocolo': protocolo
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@sugestao_bp.route('/sugestoes', methods=['GET'])
def listar_sugestoes():
    """Lista todas as sugestões"""
    try:
        sugestoes = Sugestao.query.order_by(Sugestao.data_criacao.desc()).all()
        return jsonify([s.to_dict() for s in sugestoes]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@sugestao_bp.route('/sugestoes/<protocolo>', methods=['GET'])
def buscar_sugestao(protocolo):
    """Busca uma sugestão pelo protocolo"""
    try:
        sugestao = Sugestao.query.filter_by(protocolo=protocolo).first()
        
        if not sugestao:
            return jsonify({'erro': 'Sugestão não encontrada'}), 404
        
        return jsonify(sugestao.to_dict()), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@sugestao_bp.route('/sugestoes/<int:id>', methods=['PUT'])
def atualizar_sugestao(id):
    """Atualiza uma sugestão (admin)"""
    try:
        sugestao = Sugestao.query.get(id)
        
        if not sugestao:
            return jsonify({'erro': 'Sugestão não encontrada'}), 404
        
        data = request.json
        
        if 'status' in data:
            sugestao.status = data['status']
        
        if 'resposta' in data:
            sugestao.resposta = data['resposta']
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Sugestão atualizada com sucesso',
            'sugestao': sugestao.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@sugestao_bp.route('/sugestoes/<int:id>', methods=['DELETE'])
def deletar_sugestao(id):
    """Deleta uma sugestão (admin)"""
    try:
        sugestao = Sugestao.query.get(id)
        
        if not sugestao:
            return jsonify({'erro': 'Sugestão não encontrada'}), 404
        
        db.session.delete(sugestao)
        db.session.commit()
        
        return jsonify({'mensagem': 'Sugestão deletada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

