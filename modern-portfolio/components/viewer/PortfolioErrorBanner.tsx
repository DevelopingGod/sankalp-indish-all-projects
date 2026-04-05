import { AlertCircle } from "lucide-react";

type Props = {
  message: string;
};

export function PortfolioErrorBanner({ message }: Props) {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
      role="alert"
    >
      <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">Could not load portfolio data</p>
          <p className="mt-1 text-red-800/90">{message}</p>
        </div>
      </div>
    </div>
  );
}
