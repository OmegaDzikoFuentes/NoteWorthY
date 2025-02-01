from flask.cli import AppGroup
from .users import seed_users, undo_users
from .notebooks import seed_notebooks, undo_notebooks
from .notes import seed_notes, undo_notes
from .tasks import seed_tasks, undo_tasks
from .tags import seed_tags, undo_tags
from .notes import seed_notes, undo_notes
from .tasks import seed_tasks, undo_tasks
from .notetags import seed_notetags, undo_notetags

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
<<<<<<< HEAD
        undo_notebooks()
        undo_tags()
        undo_notes()
        undo_tasks()
        undo_notetags()
        
=======
        undo_notes()
        undo_notebooks()

>>>>>>> 371edd7144ddf71eb6a5bfc7ae12ec63491498b7
    seed_users()
    seed_notebooks()
    seed_tags()
    seed_notes()
    seed_tasks()
<<<<<<< HEAD
    seed_notetags() 
=======
    seed_notes()

>>>>>>> 371edd7144ddf71eb6a5bfc7ae12ec63491498b7
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
   
    # Add other undo functions here
<<<<<<< HEAD
    undo_users()
=======
    undo_notes()
>>>>>>> 371edd7144ddf71eb6a5bfc7ae12ec63491498b7
    undo_notebooks()
    undo_tags()
    undo_notes()
    undo_tasks()
    undo_notetags()