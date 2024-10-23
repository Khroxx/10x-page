import pytest
from app import create_app, db
from app.models import Ziel, ZielHistorie
from datetime import datetime, timezone

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": 'sqlite:///:memory:'
    })
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()


def test_get_table_data(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Ziele" in response.data    # Inhalt des Templates (Title)
    print(f"index templated recieved")

def test_get_liste(client):
    response = client.get('/liste')
    assert response.status_code == 200
    assert b'Liste + Chart' in response.data
    print(f"liste template recieved")

def test_add_ziel_form(client):
    response = client.get('/add-ziel-form')
    assert response.status_code == 200
    assert b'Neues Ziel hinzu' in response.data
    print(f"add_ziel template recieved")

def test_submit_ziel(client):
    response = client.post('/submit-ziel', data={
        'abteilung': 'IT',
        'aussage': 'Test Aussage',
        'kriterium': 'Test Kriterium',
        'bewertung': 5,
        'einschätzung': 'Gut',
        'kommentar': 'Test Kommentar',
        'author': 'Test Author'
    })
    assert response.status_code == 302 
    print(f"ziel submitted")

def test_edit_ziel(client, app):
    with app.app_context():
        ziel = Ziel(abteilung='IT', aussage='Test', kriterium='Test', bewertung=5, einschätzung='Gut', geändert=datetime.now(timezone.utc), kommentar='Test', author='Test')
        db.session.add(ziel)
        db.session.commit()

        response = client.post(f'/edit-ziel/{ziel.id}', json={
            'abteilung': 'HR',
            'aussage': 'Updated Aussage',
            'kriterium': 'Updated Kriterium',
            'bewertung': 4,
            'einschätzung': 'Sehr Gut',
            'kommentar': 'Updated Kommentar',
            'author': 'Updated Author',
            'geändert': datetime.now(timezone.utc)
        })
        assert response.status_code == 200
        json_data = response.get_json()
        assert json_data['message'] == 'Ziel aktualisiert'
        print(f"Ziel edited")

def test_delete_ziel(client, app):
    with app.app_context():
        ziel = Ziel(abteilung='IT', aussage='Test', kriterium='Test', bewertung=5, einschätzung='Gut', geändert=datetime.now(timezone.utc), kommentar='Test', author='Test')
        db.session.add(ziel)
        db.session.commit()

        response = client.delete(f'/delete-ziel/{ziel.id}')
        assert response.status_code == 200
        json_data = response.get_json()
        assert json_data['message'] == 'Ziel gelöscht'
        print(f"Ziel deleted")

def test_get_ziel_historie(client):
    ziel = Ziel(abteilung='IT', aussage='Test', kriterium='Test', bewertung=5, einschätzung='Gut', geändert=datetime.now(timezone.utc), kommentar='Test', author='Test')
    db.session.add(ziel)
    db.session.commit()

    response = client.get(f'/ziel/{ziel.id}/historie')
    assert response.status_code == 200
    assert b'Historie von' in response.data
    print(f"ZielHistorie with ID recieved")

def test_get_ziele_historie(client):
    response = client.get('/api/ziele_historie')
    assert response.status_code == 200
    assert 'application/json' in response.content_type
    print(f"ZielHistorie recieved")