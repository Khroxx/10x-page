"""zielhistore changed

Revision ID: 4c4fbeda548b
Revises: 4c86e6639b37
Create Date: 2024-10-19 14:08:44.600699

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4c4fbeda548b'
down_revision = '4c86e6639b37'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ziel_historie', schema=None) as batch_op:
        batch_op.add_column(sa.Column('changed_by', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('comment', sa.String(length=255), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ziel_historie', schema=None) as batch_op:
        batch_op.drop_column('comment')
        batch_op.drop_column('changed_by')

    # ### end Alembic commands ###
