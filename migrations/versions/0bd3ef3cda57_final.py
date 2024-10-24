"""final

Revision ID: 0bd3ef3cda57
Revises: 1d699008dda0
Create Date: 2024-10-23 14:51:07.577203

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0bd3ef3cda57'
down_revision = '1d699008dda0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ziel',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('abteilung', sa.String(length=50), nullable=False),
    sa.Column('aussage', sa.String(length=255), nullable=True),
    sa.Column('kriterium', sa.String(length=255), nullable=True),
    sa.Column('bewertung', sa.Integer(), nullable=True),
    sa.Column('einschätzung', sa.String(length=255), nullable=True),
    sa.Column('geändert', sa.DateTime(), nullable=False),
    sa.Column('kommentar', sa.String(length=255), nullable=True),
    sa.Column('author', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ziel_historie',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ziel_id', sa.Integer(), nullable=False),
    sa.Column('geändert', sa.DateTime(), nullable=True),
    sa.Column('changed_by', sa.String(length=50), nullable=False),
    sa.Column('bewertung', sa.Integer(), nullable=False),
    sa.Column('comment', sa.String(length=255), nullable=False),
    sa.Column('abteilung', sa.String(length=50), nullable=False),
    sa.Column('aussage', sa.String(length=255), nullable=False),
    sa.ForeignKeyConstraint(['ziel_id'], ['ziel.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('ziel_historie')
    op.drop_table('ziel')
    # ### end Alembic commands ###
