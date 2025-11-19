from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Denuncia(db.Model):
    __tablename__ = 'denuncias'
    
    id = db.Column(db.Integer, primary_key=True)
    protocolo = db.Column(db.String(50), unique=True, nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    local = db.Column(db.String(200))
    data_incidente = db.Column(db.String(50))
    pessoas_envolvidas = db.Column(db.Text)
    urgencia = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(50), default='Pendente')
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    acoes = db.Column(db.Text)  # JSON string com histórico de ações
    

    
    def to_dict(self):
        return {
            'id': self.id,
            'protocolo': self.protocolo,
            'categoria': self.categoria,
            'descricao': self.descricao,
            'local': self.local,
            'data_incidente': self.data_incidente,
            'pessoas_envolvidas': self.pessoas_envolvidas,
            'urgencia': self.urgencia,
            'status': self.status,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'acoes': self.acoes
        }

class Sugestao(db.Model):
    __tablename__ = 'sugestoes'
    
    id = db.Column(db.Integer, primary_key=True)
    protocolo = db.Column(db.String(50), unique=True, nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(100))
    status = db.Column(db.String(50), default='Recebida')
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    resposta = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'protocolo': self.protocolo,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'categoria': self.categoria,
            'status': self.status,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'resposta': self.resposta
        }

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    perfil = db.Column(db.String(50), default='Moderador')  # Admin ou Moderador
    # email = db.Column(db.String(200))
    email = db.Column(db.String(200), unique=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'nome': self.nome,
            'perfil': self.perfil,
            'email': self.email,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'ativo': self.ativo
            
        }

