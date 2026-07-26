"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { TestTakingWidget } from "@/components/TestTakingWidget";

export default function TestTakingPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string; testId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();

  return (
    <TestTakingWidget
      testId={params.testId}
      courseSlug={params.slug}
      onExit={() => router.push(`/training/${params.slug}`)}
    />
  );
}
