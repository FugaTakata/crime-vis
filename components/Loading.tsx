export function Loading() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="absolute w-16 h-16">
        <div className="border-8 border-gray-200 rounded-full absolute top-0 right-0 bottom-0 left-0" />
        <div className="animate-spin ease-linear border-t-8 rounded-full border-blue-400 absolute top-0 right-0 bottom-0 left-0" />
      </div>
    </div>
  );
}
