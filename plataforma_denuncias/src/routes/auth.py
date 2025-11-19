from flask import Blueprint, request, jsonify, session
from src.models.denuncia import db, Usuario
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Autentica um usuário admin"""
    try:
        data = request.json
        
        if not data.get('username') or not data.get('senha'):
            return jsonify({'erro': 'Username e senha são obrigatórios'}), 400
        
        usuario = Usuario.query.filter_by(username=data['username']).first()
        
        if not usuario or not check_password_hash(usuario.senha, data['senha']):
            return jsonify({'erro': 'Credenciais inválidas'}), 401
        
        if not usuario.ativo:
            return jsonify({'erro': 'Usuário inativo'}), 403
        
        # Salva na sessão
        session['usuario_id'] = usuario.id
        session['usuario_nome'] = usuario.nome
        session['usuario_perfil'] = usuario.perfil
        
        return jsonify({
            'mensagem': 'Login realizado com sucesso',
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Faz logout do usuário"""
    session.clear()
    return jsonify({'mensagem': 'Logout realizado com sucesso'}), 200

@auth_bp.route('/me', methods=['GET'])
def me():
    """Retorna informações do usuário logado"""
    if 'usuario_id' not in session:
        return jsonify({'erro': 'Não autenticado'}), 401
    
    usuario = Usuario.query.get(session['usuario_id'])
    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado'}), 404
    
    return jsonify(usuario.to_dict()), 200

@auth_bp.route('/usuarios', methods=['POST'])
def criar_usuario():
    """Cria um novo usuário (admin)"""
    try:

       

        # Verifica se está autenticado e é admin
        if 'usuario_id' not in session or session.get('usuario_perfil') != 'Admin':
            return jsonify({'erro': 'Acesso negado'}), 403
        
        data = request.json

         # Trecho adicionado na rota /api/usuarios (POST)
        if data.get('email') and Usuario.query.filter_by(email=data['email']).first():
            return jsonify({'erro': 'Email já está em uso'}), 400
        
        # Validação
        if not data.get('username') or not data.get('senha') or not data.get('nome'):
            return jsonify({'erro': 'Username, senha e nome são obrigatórios'}), 400
        
        # Verifica se username já existe
        if Usuario.query.filter_by(username=data['username']).first():
            return jsonify({'erro': 'Username já existe'}), 400
        
        # Cria o usuário
        novo_usuario = Usuario(
            username=data['username'],
            senha=generate_password_hash(data['senha']),
            nome=data['nome'],
            perfil=data.get('perfil', 'Moderador'),
            email=data.get('email', ''),
            ativo=True
        )
        
        db.session.add(novo_usuario)
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Usuário criado com sucesso',
            'usuario': novo_usuario.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@auth_bp.route('/usuarios', methods=['GET'])
def listar_usuarios():
    """Lista todos os usuários (admin)"""
    try:
        # Verifica se está autenticado
        if 'usuario_id' not in session:
            return jsonify({'erro': 'Não autenticado'}), 401
        
        usuarios = Usuario.query.order_by(Usuario.data_criacao.desc()).all()
        return jsonify([u.to_dict() for u in usuarios]), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@auth_bp.route('/usuarios/<int:id>', methods=['PUT'])
def atualizar_usuario(id):
    """Atualiza um usuário (admin)"""
    try:
        # Verifica se está autenticado e é admin
        if 'usuario_id' not in session or session.get('usuario_perfil') != 'Admin':
            return jsonify({'erro': 'Acesso negado'}), 403
        
        usuario = Usuario.query.get(id)
        
        if not usuario:
            return jsonify({'erro': 'Usuário não encontrado'}), 404
        
        data = request.json
        
        if 'nome' in data:
            usuario.nome = data['nome']
        if 'email' in data:
            usuario.email = data['email']
        if 'perfil' in data:
            usuario.perfil = data['perfil']
        if 'ativo' in data:
            usuario.ativo = data['ativo']
        if 'senha' in data and data['senha']:
            usuario.senha = generate_password_hash(data['senha'])
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Usuário atualizado com sucesso',
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@auth_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def deletar_usuario(id):
    """Deleta um usuário (admin)"""
    try:
        # Verifica se está autenticado e é admin
        if 'usuario_id' not in session or session.get('usuario_perfil') != 'Admin':
            return jsonify({'erro': 'Acesso negado'}), 403
        
        # Não pode deletar a si mesmo
        if session['usuario_id'] == id:
            return jsonify({'erro': 'Não é possível deletar seu próprio usuário'}), 400
        
        usuario = Usuario.query.get(id)
        
        if not usuario:
            return jsonify({'erro': 'Usuário não encontrado'}), 404
        
        db.session.delete(usuario)
        db.session.commit()
        
        return jsonify({'mensagem': 'Usuário deletado com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

