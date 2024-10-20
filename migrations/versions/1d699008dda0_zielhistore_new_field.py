"""zielhistore new field

Revision ID: 1d699008dda0
Revises: 4c4fbeda548b
Create Date: 2024-10-20 09:31:15.997127

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d699008dda0'
down_revision = '4c4fbeda548b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ziel_historie', schema=None) as batch_op:
        batch_op.add_column(sa.Column('aussage', sa.String(length=255), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ziel_historie', schema=None) as batch_op:
        batch_op.drop_column('aussage')

    # ### end Alembic commands ###