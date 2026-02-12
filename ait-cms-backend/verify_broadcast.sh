#!/bin/bash

# Configuration
API_URL="http://localhost:3000/api/v1"
ADMIN_EMAIL="admin@ait.edu"
ADMIN_PASS="password123"
TEACHER_EMAIL="smore@ait.edu"
TEACHER_PASS="password123"

echo "=== Broadcast Verification ==="

# 1. Login as Admin
echo "Logging in as Admin..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" | jq -r '.data.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Admin Login failed!"
  exit 1
fi
echo "Admin Login successful."

# 2. Test Student Filtering (Admin)
echo "Testing Student filtering (Department & Year)..."
STUDENTS_RES=$(curl -s -X GET "$API_URL/students?limit=5&year=1" \
  -H "Authorization: Bearer $TOKEN")
COUNT=$(echo $STUDENTS_RES | jq '.data.data | length')
echo "Found $COUNT first year students."

# 3. Login as Teacher
echo "Logging in as Teacher..."
T_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEACHER_EMAIL\",\"password\":\"$TEACHER_PASS\"}" | jq -r '.data.accessToken')

if [ "$T_TOKEN" == "null" ] || [ -z "$T_TOKEN" ]; then
  echo "Teacher Login failed!"
  exit 1
fi
echo "Teacher Login successful."

# 4. Test Teacher access to Broadcast (Bulk Notifications)
echo "Testing Teacher access to Bulk Notifications..."
BULK_RES=$(curl -s -X POST "$API_URL/notifications/bulk" \
  -H "Authorization: Bearer $T_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Broadcast","message":"Hello from Teacher","userIds":["any-id-works-for-permission-check"]}')

# Even if ID is invalid, it should return 400 or something if auth passes, 
# but if it returns 403 then permissions failed.
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/notifications/bulk" \
  -H "Authorization: Bearer $T_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Broadcast","message":"Hello from Teacher","userIds":[]}')

echo "Bulk Notification HTTP Code: $HTTP_CODE (Expected 201 or 400, not 403)"

# 5. Test Teacher access to findByDepartment
echo "Testing Teacher access to findByDepartment..."
DEPT_ID="9e7a8b6c-5d4e-4c3b-b2a1-0f9e8d7c6b5a" # Placeholder or from earlier seed
DEPT_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/teachers/department/$DEPT_ID" \
  -H "Authorization: Bearer $T_TOKEN")

echo "Department Teachers HTTP Code: $DEPT_HTTP (Expected 200 or 404, not 403)"

echo "=== Verification Complete ==="
