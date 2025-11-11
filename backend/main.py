from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

# Allow CORS for frontend localhost assuming default port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility function to check if graph is DAG
def is_dag(nodes, edges):
    graph = {node['id']: [] for node in nodes}
    for edge in edges:
        graph[edge['source']].append(edge['target'])

    visited = set()
    rec_stack = set()

    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(node)
        return False

    for node in graph:
        if node not in visited:
            if dfs(node):
                return False
    return True

@app.post('/pipelines/parse')
async def parse_pipeline(pipeline: str = Form(...)):
    data = json.loads(pipeline)
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    num_nodes = len(nodes)
    num_edges = len(edges)
    dag_status = is_dag(nodes, edges)
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': dag_status}
