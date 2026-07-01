import psycopg2

DB_CONFIG = {
    "dbname": "smartrent_iai4",
    "user": "postgrest",
    "password": "3vRpa7lBJJtAggC7j1IeL1I5XGxoZhRx",
    "host": "dpg-d8vg5tmrnols73dls3pg-a.oregon-postgres.render.com",
    "port": "5432",
    "sslmode": "require"
}


def connect():
    return psycopg2.connect(**DB_CONFIG)


def list_tables(cursor):
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()

    if not tables:
        print("\nNo hay tablas en la base de datos.")
        return

    print("\nTablas disponibles:")
    for table in tables:
        print(f"- {table[0]}")


def execute_query(cursor, conn):
    query = input("\nIngresa tu sentencia SQL:\n> ")

    try:
        cursor.execute(query)

        # Si la consulta devuelve resultados
        if cursor.description is not None:
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()

            print("\nColumnas:")
            print(" | ".join(columns))

            print("-" * 60)

            if rows:
                for row in rows:
                    print(row)
            else:
                print("La consulta no devolvió registros.")
        else:
            conn.commit()
            print(f"\nComando ejecutado correctamente.")
            print(f"Filas afectadas: {cursor.rowcount}")

    except Exception as e:
        conn.rollback()
        print(f"\nError:\n{e}")


def main():
    try:
        conn = connect()
        cur = conn.cursor()

        print("===================================")
        print("Conectado correctamente a PostgreSQL")
        print("===================================")

        while True:
            print("\n--- Menú SQL ---")
            print("1. Listar tablas")
            print("2. Ejecutar SQL")
            print("3. Salir")

            choice = input("Selecciona una opción: ")

            if choice == "1":
                list_tables(cur)

            elif choice == "2":
                execute_query(cur, conn)

            elif choice == "3":
                break

            else:
                print("Opción inválida.")

        cur.close()
        conn.close()
        print("\nConexión cerrada.")

    except Exception as e:
        print("\nNo fue posible conectarse a la base de datos.")
        print(e)


if __name__ == "__main__":
    main()