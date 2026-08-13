#!/usr/bin/env python
import os
import sys
from pathlib import Path


def use_project_virtual_environment() -> None:
    """Allow the usual `python manage.py …` command on Windows without activation."""
    if os.name != "nt" or os.environ.get("SEMNAN_SKIP_VENV_BOOTSTRAP") == "1":
        return

    virtual_python = Path(__file__).resolve().parent / ".venv" / "Scripts" / "python.exe"
    current_python = Path(sys.executable).resolve()
    if virtual_python.exists() and current_python != virtual_python.resolve():
        os.execv(str(virtual_python), [str(virtual_python), *sys.argv])


def main() -> None:
    use_project_virtual_environment()
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
