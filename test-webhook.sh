#!/bin/bash

# Teste local do webhook RecipesAPI
# Execute este arquivo com: bash test-webhook.sh

API_URL="${1:-http://localhost:3000}"

echo "🧪 Testando RecipesAPI em $API_URL\n"

# Teste 1: Health check
echo "1️⃣  Teste de health check..."
curl -X GET "$API_URL/" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Teste 2: Webhook com payload simples
echo "2️⃣  Teste de webhook com payload simples..."
curl -X POST "$API_URL/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "type": "automation",
      "automation_id": "2c61d68b-57be-80ff-bc36-004d3ae9a5ec"
    },
    "data": {
      "object": "page",
      "id": "2c61d68b-57be-803b-bacf-e3dc971d88ef",
      "properties": {
        "Nome da Receita": {
          "id": "title",
          "type": "title",
          "title": [
            {
              "type": "text",
              "text": {
                "content": "Guacamole",
                "link": null
              },
              "plain_text": "Guacamole"
            }
          ]
        },
        "Categoria": {
          "id": "select",
          "type": "select",
          "select": {
            "id": "1",
            "name": "Aperitivo",
            "color": "blue"
          }
        },
        "Ingredientes": {
          "id": "rich_text",
          "type": "rich_text",
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "2 abacates\n1 limão\n2 tomates\nSal a gosto"
              },
              "plain_text": "2 abacates\n1 limão\n2 tomates\nSal a gosto"
            }
          ]
        },
        "Porções": {
          "id": "number",
          "type": "number",
          "number": 4
        },
        "Tempo de Preparo": {
          "id": "number",
          "type": "number",
          "number": 15
        }
      }
    }
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Teste 3: Webhook com requisição inválida (sem Content-Type correto)
echo "3️⃣  Teste com Content-Type inválido (deve retornar 403)..."
curl -X POST "$API_URL/webhook" \
  -H "Content-Type: text/plain" \
  -d 'invalid data' \
  -w "\nStatus: %{http_code}\n\n"

# Teste 4: Webhook com payload inválido (deve retornar 400)
echo "4️⃣  Teste com payload inválido (JSON mal formado)..."
curl -X POST "$API_URL/webhook" \
  -H "Content-Type: application/json" \
  -d 'not a json' \
  -w "\nStatus: %{http_code}\n\n"

echo "✅ Testes concluídos!\n"
