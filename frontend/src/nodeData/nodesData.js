import { FeedbackIcon, FormIcon, KnowledgeBaseIcon, LlmIcon, ResultIcon } from "../icons/icons";

export const nodesData = [
    {
        nodeId: "custome_node_1",
        title: "User Form",
        label: "Form",
        tooltipDescription: "Captures structured user input for downstream processing.",
        modalType: "customInput",
        category: "input",
        icon: FormIcon,
        variableInputFields: { hasField: true, hasType: true },
        normalInputFields: [
            { id: 0, label: "Name", placeholder: "Enter user name" },
            { id: 1, label: "Email", placeholder: "Enter email" },
            { id: 2, label: "Query", placeholder: "Enter your request" },
        ],
        inputs: [{
            id: "text_form_output_1",
            style: { top: "50%" },
        },],
        outputs: [
            // {
            //     id: "text_form_output_1",
            //     style: { top: "50%" },
            // },
        ],
    },

    {
        nodeId: "knowledgeContext_node_1",
        title: "Knowledge Base",
        label: "KDB",
        tooltipDescription: "Supplies contextual data to LLM.",
        modalType: "knowledgeContext",
        category: "data",
        icon: KnowledgeBaseIcon,
        variableInputFields: { hasField: false, hasType: false },
        normalInputFields: [
            { id: 0, label: "Dataset Name", placeholder: "name of the file" },
            { id: 1, label: "Context Query", placeholder: "retrieve by topic" },
        ],
        inputs: [
            // {
            //     id: "kdb_input_1",
            //     style: { top: `${100 / 3}%` },
            // },

        ],
        outputs: [
            {
                id: "kdb_output_1",
                style: { top: "50%" },
            },
        ],
    },

    {
        nodeId: "llm_node_1",
        title: "LLM Processor",
        label: "LLM",
        tooltipDescription: "Processes user input and contextual knowledge to generate.",
        modalType: "llm",
        category: "process",
        icon: LlmIcon,
        variableInputFields: { hasField: false, hasType: false },
        normalInputFields: [
            { id: 0, label: "Prompt", placeholder: "Enter a prompt" },
            { id: 1, label: "System Role", placeholder: "Assistant / Analyst" },
        ],
        inputs: [
            // {
            //     id: "llm_input_1",
            //     style: { top: `${100 / 3}%` },
            // },
            // {
            //     id: "llm_input_2",
            //     style: { top: `${200 / 3}%` },
            // },
        ],
        outputs: [
            {
                id: "llm_output_1",
                style: { top: "50%" },
            },
        ],
    },

    {
        nodeId: "output_node_1",
        title: "Result Viewer",
        label: "Output",
        tooltipDescription: "Displays the final response from the LLM.",
        modalType: "customOutput1",
        category: "output",
        icon: ResultIcon,
        variableInputFields: { hasField: false, hasType: false },
        normalInputFields: [],
        inputs: [
            {
                id: "output_input_1",
                style: { top: "50%" },
            },
        ],
        outputs: [
            {
                id: "output_output_1",
                style: { top: "80%" },
            },
        ],
    },

    {
        nodeId: "node_custom_1",
        title: "Feedback Collector",
        label: "Feedback",
        tooltipDescription: "Captures user feedback to improve model performance.",
        modalType: "customErrorModal1",
        category: "error",
        icon: FeedbackIcon,
        variableInputFields: { hasField: false, hasType: false },
        normalInputFields: [
            { id: 0, label: "Feedback", placeholder: "Enter your feedback" },
            { id: 1, label: "Rating", placeholder: "0-5" },
        ],
        inputs: [
            // {
            //     id: "feedback_input_1",
            //     style: { top: "50%" },
            // },
        ],
        outputs: [
            {
                id: "feedback_input_1",
                style: { top: "50%" },
            },
        ],
    },
];
