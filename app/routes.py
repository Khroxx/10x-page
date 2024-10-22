from flask import Blueprint, redirect, url_for, request, jsonify, render_template
from sqlalchemy import func
from .models import *
from datetime import datetime, timezone
from . import db


main = Blueprint('main', __name__)

# renders index.html with data ziele
@main.route('/', methods=['GET']) # TEX 10 Tabelle
def get_table_data():
    ziele = Ziel.query.all()
    return render_template('index.html', ziele=ziele)

# renders liste.html
@main.route('/liste', methods=['GET']) # grafische Auswertung
def get_liste():
    ziele = Ziel.query.all()
    durchschnitt = db.session.query(func.avg(Ziel.bewertung)).scalar()
    durchschnitt = round(durchschnitt, 2)  
    return render_template('liste.html', ziele=ziele, abteilungen=ABTEILUNGEN_CHOICES, durchschnitt=durchschnitt)

# not used?
@main.route('/api/ziele')
def get_ziele():
    ziele = Ziel.query.order_by(Ziel.geändert.desc()).all()
    data = [{
        'datum': ziel.geändert.strftime('%d.%m.%Y'),
        'bewertung': ziel.bewertung,
        'abteilung': ziel.abteilung
    } for ziel in ziele]
    return jsonify(data)

# renders add_ziel.html with data
@main.route('/add-ziel-form', methods=['GET'])  
def add_ziel_form():
    return render_template('add_ziel.html', abteilungen=ABTEILUNGEN_CHOICES, authors=PERSONAL_CHOICES,
                           bewertungen=BEWERTUNG_CHOICES)

# Submit form to send data to create Ziel
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

# addes Ziel to DB
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

# edits Ziel with id and creates ZielHistorie
@main.route('/edit-ziel/<int:id>', methods=['POST'])
def edit_ziel(id):
    data = request.get_json()
    ziel = Ziel.query.get(id)
    if not ziel:
        return jsonify({"message": "Ziel nicht gefunden"}), 404
    
    histore_eintrag = ZielHistorie(
        ziel_id=ziel.id,
        geändert=ziel.geändert,
        changed_by=data['author'],
        bewertung=ziel.bewertung,
        comment=data.get('kommentar', ''),
        abteilung=ziel.abteilung,
        aussage=ziel.aussage
    )
    db.session.add(histore_eintrag)
    
    ziel.abteilung = data.get('abteilung', ziel.abteilung)
    ziel.aussage = data.get('aussage', ziel.aussage)
    ziel.kriterium = data.get('kriterium', ziel.kriterium)
    ziel.bewertung = int(data.get('bewertung', ziel.bewertung))
    ziel.einschätzung = data.get('einschätzung', ziel.einschätzung)
    ziel.geändert = datetime.now(timezone.utc)
    ziel.kommentar = data.get('kommentar', ziel.kommentar)
    ziel.author = data.get('author', ziel.author)
    
    db.session.commit()
    return jsonify({"message": "Ziel aktualisiert"}), 200

# deletes Ziel with id
@main.route('/delete-ziel/<int:id>', methods=['DELETE'])
def delete_ziel(id):
    ziel = Ziel.query.get(id)
    if not ziel:
        return jsonify({"message": "Ziel nicht gefunden"})
    
    db.session.delete(ziel)
    db.session.commit()
    return jsonify({"message": "Ziel gelöscht"}), 200

# sends data for Ziel Historie
@main.route('/ziel/<int:ziel_id>/historie', methods=['GET'])
def get_ziel_historie(ziel_id):
    ziel = Ziel.query.get_or_404(ziel_id)
    historie = ZielHistorie.query.filter_by(ziel_id=ziel_id).order_by(ZielHistorie.geändert.desc()).all()
    return render_template('ziel_historie.html', ziel=ziel, historie=historie)

# sends Ziel Historie data for ChartJS
@main.route('/api/ziele_historie', methods=['GET'])
def get_ziele_historie():
    ziele = Ziel.query.all()
    data = []
    for ziel in ziele:
        historie = ZielHistorie.query.filter_by(ziel_id=ziel.id).order_by(ZielHistorie.geändert.asc()).all()
        for eintrag in historie:
            data.append({
                'ziel_id': ziel.id,
                'datum': eintrag.geändert.strftime('%d.%m.%Y'),
                'bewertung': eintrag.bewertung,
                'abteilung': ziel.abteilung
            })
    return jsonify(data)