import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faDatabase,
    faRobot,
    faComments,
    faChartLine,
    faArrowRightArrowLeft,
    faArrowRightToBracket,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";

const Icon = ({ icon, color = "text-white", className = "", ...props }) => (
    <FontAwesomeIcon icon={icon} className={`${color} ${className}`} {...props} />
);

export const DeleteIcon = ({ color }) => <Icon icon={faTrash} color={color || "text-white"} />;
export const FormIcon = ({ color }) => <Icon icon={faWpforms} color={color || "text-white"} />;
export const KnowledgeBaseIcon = ({ color }) => <Icon icon={faDatabase} color={color || "text-white"} />;
export const LlmIcon = ({ color }) => <Icon icon={faRobot} color={color || "text-white"} />;
export const FeedbackIcon = ({ color }) => <Icon icon={faComments} color={color || "text-white"} />;
export const ResultIcon = ({ color }) => <Icon icon={faChartLine} color={color || "text-white"} />;
export const InfoIcon = ({ color }) => <Icon icon={faInfoCircle} color={color || "text-gray-800"} />;
export const NodeIcon = ({ color }) => <Icon icon={faArrowRightArrowLeft} color={color || "text-orange-400"} />;
export const InputIcon = ({ color }) => <Icon icon={faArrowRightToBracket} color={color || "text-cyan-400"} className="rotate-180" />;
export const OutputIcon = ({ color }) => <Icon icon={faArrowRightToBracket} color={color || "text-cyan-400"} />;
