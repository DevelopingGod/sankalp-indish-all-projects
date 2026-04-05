export function GallerySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mx-auto mb-8 h-9 max-w-xs rounded-md bg-[#dee2e6]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-56 rounded-lg border border-[#e9ecef] bg-white shadow-sm"
            >
              <div className="h-full rounded-lg bg-[#f1f3f5]" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[#dee2e6] bg-[#f8f9fa] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 h-9 max-w-[200px] rounded-md bg-[#dee2e6]" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-[#e9ecef] bg-white shadow-sm"
              >
                <div className="aspect-[16/10] bg-[#e9ecef]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-[#e9ecef]" />
                  <div className="h-3 w-full rounded bg-[#f1f3f5]" />
                  <div className="h-3 w-5/6 rounded bg-[#f1f3f5]" />
                  <div className="h-9 w-28 rounded-md bg-[#cfe2ff]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
