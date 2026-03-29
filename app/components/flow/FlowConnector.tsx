interface FlowConnectorProps {
  completed: boolean;
}

export function FlowConnector({ completed }: FlowConnectorProps) {
  return (
    <div className="flex items-center w-6 shrink-0">
      <div
        className={`h-[2px] flex-1 transition-colors duration-500 ${
          completed ? "bg-green-500" : "bg-gray-200"
        }`}
      />
    </div>
  );
}
