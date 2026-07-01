#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_PATH="${1:-$SCRIPT_DIR/shopping.db}"

rm -f "$DB_PATH"

sqlite3 "$DB_PATH" < "$SCRIPT_DIR/schema.sql"
sqlite3 "$DB_PATH" < "$SCRIPT_DIR/seed.sql"

echo "Shopping database created at: $DB_PATH"
echo ""
echo "Tables:"
sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
echo ""
echo "Sample products:"
sqlite3 -header -column "$DB_PATH" "SELECT p.id, p.name, p.price, p.stock_quantity, c.name AS category FROM products p JOIN categories c ON c.id = p.category_id LIMIT 5;"
