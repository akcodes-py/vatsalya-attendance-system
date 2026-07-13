# 1. Grab a small Linux computer with Python 3.10 installed
FROM python:3.10-slim

# 2. Make a folder inside the container called /app
WORKDIR /app

# 3. Copy our requirements list into the container
# (We assume requirements.txt is inside the backend folder)
COPY requirements.txt .

# 4. Install all the Python packages from that list
RUN pip install -r requirements.txt

# 5. Copy the rest of our backend code into the container
COPY . .

# 6. Expose port 8000 so the outside world can connect
EXPOSE 8000

# 7. Start the Django server!
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
