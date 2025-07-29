"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"

interface JenisCuti {
  id: number
  nama_izin: string
  maksimal_hari_per_tahun: number
  keterangan?: string
  perlu_dokumen: boolean
  approval_berjenjang: boolean
}

interface CutiKuota {
  id: number
  jenis_cuti_id: number
  jatah_total: number
  jatah_terpakai: number
  jenis_cuti_nama: string
}

export default function NewCutiPage() {
  const [jenisCutiList, setJenisCutiList] = useState<JenisCuti[]>([])
  const [kuotaList, setKuotaList] = useState<CutiKuota[]>([])
  const [formData, setFormData] = useState({
    jenis_cuti_id: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    alasan: "",
    dokumen: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [jenisCutiResponse, kuotaResponse] = await Promise.all([fetch("/api/jenis-cuti"), fetch("/api/cuti/kuota")])

      if (jenisCutiResponse.ok) {
        const jenisCutiData = await jenisCutiResponse.json()
        setJenisCutiList(jenisCutiData)
      }

      if (kuotaResponse.ok) {
        const kuotaData = await kuotaResponse.json()
        setKuotaList(kuotaData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const selectedJenisCuti = jenisCutiList.find((jc) => jc.id.toString() === formData.jenis_cuti_id)
  const selectedKuota = kuotaList.find((k) => k.jenis_cuti_id.toString() === formData.jenis_cuti_id)
  const daysRequested = calculateDays(formData.tanggal_mulai, formData.tanggal_selesai)
  const sisaKuota = selectedKuota ? selectedKuota.jatah_total - selectedKuota.jatah_terpakai : 0

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, dokumen: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (daysRequested <= 0) {
      setError("Tanggal tidak valid")
      setIsLoading(false)
      return
    }

    if (daysRequested > sisaKuota) {
      setError(`Jumlah hari yang diminta (${daysRequested}) melebihi sisa kuota (${sisaKuota})`)
      setIsLoading(false)
      return
    }

    if (selectedJenisCuti?.perlu_dokumen && !formData.dokumen) {
      setError("Dokumen pendukung wajib diunggah untuk jenis cuti ini")
      setIsLoading(false)
      return
    }

    try {
      const submitData = new FormData()
      submitData.append("jenis_cuti_id", formData.jenis_cuti_id)
      submitData.append("tanggal_mulai", formData.tanggal_mulai)
      submitData.append("tanggal_selesai", formData.tanggal_selesai)
      submitData.append("alasan", formData.alasan)
      submitData.append("days_requested", daysRequested.toString())

      if (formData.dokumen) {
        submitData.append("dokumen", formData.dokumen)
      }

      const response = await fetch("/api/cuti", {
        method: "POST",
        body: submitData,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Pengajuan cuti berhasil disubmit!")
        setTimeout(() => {
          router.push("/cuti")
        }, 2000)
      } else {
        setError(data.error || "Gagal mengajukan cuti")
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ id: 0, nama: "", email: "", role: "karyawan" }} />

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/cuti" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Cuti
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ajukan Cuti Baru</CardTitle>
            <CardDescription>Isi formulir di bawah untuk mengajukan cuti</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="jenis_cuti_id">Jenis Cuti</Label>
                <Select
                  value={formData.jenis_cuti_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, jenis_cuti_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis cuti" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisCutiList.map((jenis) => (
                      <SelectItem key={jenis.id} value={jenis.id.toString()}>
                        {jenis.nama_izin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedJenisCuti && <p className="text-sm text-gray-600">{selectedJenisCuti.keterangan}</p>}
              </div>

              {selectedKuota && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Sisa kuota:</strong> {sisaKuota} dari {selectedKuota.jatah_total} hari
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                  <Input
                    id="tanggal_mulai"
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tanggal_mulai: e.target.value }))}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                  <Input
                    id="tanggal_selesai"
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tanggal_selesai: e.target.value }))}
                    required
                    min={formData.tanggal_mulai || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {daysRequested > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Jumlah hari:</strong> {daysRequested} hari
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="alasan">Alasan Cuti</Label>
                <Textarea
                  id="alasan"
                  placeholder="Jelaskan alasan pengajuan cuti Anda"
                  value={formData.alasan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alasan: e.target.value }))}
                  required
                  rows={4}
                />
              </div>

              {selectedJenisCuti?.perlu_dokumen && (
                <div className="space-y-2">
                  <Label htmlFor="dokumen">
                    Dokumen Pendukung <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="dokumen"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      required
                    />
                    <Upload className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">Format yang didukung: PDF, JPG, PNG, DOC, DOCX (Max: 5MB)</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengajukan...
                    </>
                  ) : (
                    "Ajukan Cuti"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/cuti">Batal</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
