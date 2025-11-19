import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.denuncia import db, Usuario
from src.routes.denuncia import denuncia_bp
from src.routes.sugestao import sugestao_bp
from src.routes.auth import auth_bp
from werkzeug.security import generate_password_hash



app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

#  app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# Habilita CORS
CORS(app, supports_credentials=True)

# Registra blueprints
app.register_blueprint(denuncia_bp, url_prefix='/api')
app.register_blueprint(sugestao_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

# Configuração do banco de dados
# app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://neondb_owner:npg_7KOwN2WBcpZf@ep-old-frog-adrqd8ox-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    
    # Cria usuário admin padrão se não existir
    admin = Usuario.query.filter_by(username='admin').first()
    if not admin:
        admin = Usuario(
            username='admin',
            senha=generate_password_hash('admin123'),
            nome='Administrador',
            perfil='Admin',
            email='admin@escola.com',
            ativo=True
        )
        db.session.add(admin)
        db.session.commit()
        print("Usuário admin criado: username=admin, senha=admin123")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

