"use client";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { getAllInstitutions } from "@/service/institution";
import { Users } from "lucide-react";
import { InstitutionTableClient } from "./_components/table";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@/hook/useQuery";

export default function Page() {
  const { user, loading } = useAuth();
  const { data: institutions } = useQuery("institutions", "institutions");

  return (
    <div className="min-h-screen bg-gray-50">
      {!user && loading ? <div>Loading...</div> : <Navbar user={user as any} />}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Data Lembaga</h1>
            <p className="text-gray-600">
              Lihat & kelola semua lembaga yang terdaftar
            </p>
          </div>

          {institutions ? (
            <InstitutionTableClient data={institutions} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">
                  Belum ada lembaga yang terdaftar nih
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
