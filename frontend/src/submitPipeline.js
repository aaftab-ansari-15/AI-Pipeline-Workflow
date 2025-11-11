import { useStore } from './store';

async function submitPipeline() {
    const nodes = useStore.getState().nodes;
    const edges = useStore.getState().edges;

    const pipeline = {
        nodes: nodes,
        edges: edges,
    };

    try {
        const formData = new FormData();
        formData.append('pipeline', JSON.stringify(pipeline));

        const response = await fetch('https://ai-pipeline-workflow-2mv2.vercel.app/pipelines/parse', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        alert(
            `Pipeline submitted successfully!\n` +
            `Number of nodes: ${result.num_nodes}\n` +
            `Number of edges: ${result.num_edges}\n` +
            `Is DAG: ${result.is_dag ? 'Yes' : 'No'}`
        );
    } catch (error) {
        alert('Error submitting pipeline: ' + error.message);
    }
}

export default submitPipeline;
