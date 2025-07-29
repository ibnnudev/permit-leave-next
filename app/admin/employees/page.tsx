import { requireAdmin } from "@/lib/auth"
import { getAllEmployees } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Mail, Calendar, Building } from "lucide-react"

export default async function EmployeesPage() {
  const user = await requireAdmin()
  const employees = await getAllEmployees()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600">Manage all employees in the system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <Card key={employee.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {employee.first_name.charAt(0)}
                        {employee.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {employee.first_name} {employee.last_name}
                      </CardTitle>
                      <CardDescription>{employee.position}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{employee.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Hired: {new Date(employee.hire_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>ID: {employee.employee_id}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Annual Leave:</span>
                        <Badge variant="outline">{employee.annual_leave_days} days</Badge>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Sick Leave:</span>
                        <Badge variant="outline">{employee.sick_leave_days} days</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {employees.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No employees found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
