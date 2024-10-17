from flask import Blueprint, redirect, url_for, request, jsonify, render_template
from .models import *
from . import db


main = Blueprint('main', __name__)


@main.route('/', methods=['GET']) # TEX 10 Tabelle
def get_table_data():
    ziele = Ziel.query.all()
    return render_template('index.html', ziele=ziele)


@main.route('/liste', methods=['GET']) # grafische Auswertung
def get_liste():
    ziele = Ziel.query.all()
    return render_template('liste.html', ziele=ziele, abteilungen=ABTEILUNGEN_CHOICES)


@main.route('/api/ziele')
def get_ziele():
    ziele = Ziel.query.order_by(Ziel.geändert.desc()).all()
    data = [{
        'datum': ziel.geändert.strftime('%d-%m-%Y'),
        'bewertung': ziel.bewertung,
        'abteilung': ziel.abteilung
    } for ziel in ziele]
    return jsonify(data)


@main.route('/add-ziel-form', methods=['GET']) # Um ein Ziel hinzuzufügen
def add_ziel_form():
    return render_template('add_ziel.html', abteilungen=ABTEILUNGEN_CHOICES, authors=PERSONAL_CHOICES,
                           bewertungen=BEWERTUNG_CHOICES)


@main.route('/submit-ziel', methods=['POST'])
def submit_ziel():
    abteilung = request.form.get('abteilung')
    aussage = request.form.get('aussage')
    kriterium = request.form.get('kriterium')
    bewertung = int(request.form.get('bewertung'))
    einschätzung = request.form.get('einschätzung')
    geändert = datetime.now(timezone.utc)
    kommentar = request.form.get('kommentar')
    author = request.form.get('author')

    new_ziel = Ziel(abteilung=abteilung, aussage=aussage, kriterium=kriterium,
                    bewertung=bewertung, einschätzung=einschätzung, geändert=geändert,
                    kommentar=kommentar, author=author)
    db.session.add(new_ziel)
    db.session.commit()

    return redirect(url_for('main.get_table_data'))

@main.route('/add-ziel', methods=['POST'])
def add_ziel():
    data = request.get_json()
    new_ziel = Ziel(abteilung=data['abteilung'], aussage=data['aussage'],
                    kriterium=data['kriterium'], bewertung=data['bewertung'],
                    einschätzung=data['einschätzung'], geändert=data['geändert'],
                    kommentar=data['kommentar'], author=data['author'])

    db.session.add(new_ziel)
    db.session.commit()

    return jsonify({"message": "Ziel hinzugefügt"}), 201


@main.route('/edit-ziel/<int:id>', methods=['POST'])
def edit_ziel(id):
    data = request.get_json()
    ziel = Ziel.query.get(id)
    if not ziel:
        return jsonify({"message": "Ziel nicht gefunden"}), 404
    
    ziel.abteilung = data['abteilung']
    ziel.aussage = data['aussage']
    ziel.kriterium = data['kriterium']
    ziel.bewertung = data['bewertung']
    ziel.einschätzung = data['einschätzung']
    ziel.geändert = data['geändert']
    ziel.kommentar = data['kommentar']
    ziel.author = data['author']
    
    db.session.commit()
    return jsonify({"message": "Ziel aktualisiert"}), 200

@main.route('/delete-ziel/<int:id>', methods=['DELETE'])
def delete_ziel(id):
    ziel = Ziel.query.get(id)
    if not ziel:
        return jsonify({"message": "Ziel nicht gefunden"})
    
    db.session.delete(ziel)
    db.session.commit()
    return jsonify({"message": "Ziel gelöscht"}), 200