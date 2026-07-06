from ai import calculate_match

resume = """
Python
FastAPI
MongoDB
React
JWT
"""

job = """
Looking for Python Developer.
React experience required.
MongoDB knowledge required.
"""

print(calculate_match(resume, job))