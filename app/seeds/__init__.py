from flask.cli import AppGroup
from .users import seed_users, undo_users
from .notebooks import seed_notebooks, undo_notebooks
#(OD) imported notes and task seed/undo functions
from .notes import seed_notes, undo_notes
from .tasks import seed_tasks, undo_tasks


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

        undo_notebooks
        #(OD) added undo/seed functions for tasks and notes

        undo_notes()
        undo_tasks()



    seed_users()
    seed_notebooks()

    # Add other seed functions here
    #(OD) added seed function for notes and tasks
    seed_notes()
    seed_tasks


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    # Add other undo functions here

    undo_notebooks()
    #(OD) added undo functions for notes and tasks
    undo_notes()
    undo_tasks()
