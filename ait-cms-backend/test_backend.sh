#!/bin/bash
API_URL="http://localhost:3000/api/v1"

echo "1. Logging in as Teacher..."
LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"smore@ait.edu","password":"password123"}')

TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login Failed"
  echo $LOGIN_RES
  exit 1
fi

echo "✅ Login Successful. Token obtained."

echo "2. Fetching My Subjects..."
SUBJECTS_RES=$(curl -s -X GET "$API_URL/teachers/my-subjects" \
  -H "Authorization: Bearer $TOKEN")

if [[ $SUBJECTS_RES == *"code"* ]]; then
  echo "✅ Endpoint Works!"
  echo $SUBJECTS_RES
else
  echo "❌ Endpoint Failed"
  echo $SUBJECTS_RES
fi

echo "3. Testing Public Download (Fake ID)..."
DOWNLOAD_RES=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/files/12345/download")
echo "Download Status: $DOWNLOAD_RES"
if [ "$DOWNLOAD_RES" == "404" ] || [ "$DOWNLOAD_RES" == "200" ]; then
    echo "✅ Public Download seems accessible (404/200 is good, 401 is bad)"
else
    echo "❌ Public Download might be blocked: $DOWNLOAD_RES"
fi
