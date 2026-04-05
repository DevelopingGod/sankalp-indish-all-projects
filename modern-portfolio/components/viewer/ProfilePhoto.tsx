"use client";

import Image from "next/image";
import { useState } from "react";

export function ProfilePhoto() {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className="mx-auto flex aspect-square w-[min(80%,280px)] max-w-[280px] items-center justify-center rounded-full border-[5px] border-white bg-[#0d6efd]/10 text-3xl font-bold text-[#0d6efd] shadow-lg"
        style={{ boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)" }}
        aria-hidden
      >
        SI
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-[min(80%,280px)] max-w-[280px]">
      <Image
        src="/profile-image.png"
        alt="Sankalp Indish"
        width={320}
        height={320}
        className="aspect-square rounded-full border-[5px] border-white object-cover shadow-lg"
        style={{ boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)" }}
        onError={() => setBroken(true)}
        priority
      />
    </div>
  );
}
