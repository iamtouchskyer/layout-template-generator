"""Geometry snapshot checks for SmartArt layout algorithms."""

from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parents[1]
VERIFY_SCRIPT = ROOT / 'scripts' / 'verify-smartart-layout-snapshots.sh'


def test_layout_snapshots_match_baseline():
    result = subprocess.run(
        [str(VERIFY_SCRIPT)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, f"{result.stdout}\n{result.stderr}"
