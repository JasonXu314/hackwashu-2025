import { X, Sparkles } from 'lucide-react';

const SummaryModal = ({ summary, onClose }: { summary: string; onClose: () => void }) => {
	return (
		<div className="bg-black bg-opacity-50 flex items-center justify-center z-20 fixed inset-0">
			<div className="bg-white rounded-2xl p-6 shadow-lg relative max-w-md w-full">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
				>
					<X size={20} />
				</button>
				<h2 className="text-lg font-semibold mb-2 flex gap-3 items-center"><Sparkles color="#793BFF"/>Session Summary</h2>
				<p>{summary}</p>
			</div>
		</div>
	);
};

export default SummaryModal;