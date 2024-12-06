import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
  TableCaption,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const items = [
  { name: "Item 1", description: "Description 1", quantity: 10 },
  { name: "Item 2", description: "Description 2", quantity: 5 },
  { name: "Item 3", description: "Description 3", quantity: 12 },
  { name: "Item 4", description: "Description 4", quantity: 8 },
  { name: "Item 5", description: "Description 5", quantity: 4 },
  { name: "Item 6", description: "Description 6", quantity: 15 },
  { name: "Item 7", description: "Description 7", quantity: 2 },
  { name: "Item 8", description: "Description 8", quantity: 20 },
  { name: "Item 9", description: "Description 9", quantity: 9 },
  { name: "Item 10", description: "Description 10", quantity: 7 },
];

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Welcome to your Dashboard</h2>
      <p className="text-lg mb-6">
        Here, you can see the overview of your items and manage them.
      </p>

      {/* Items Table Section */}
      <section className="p-6 bg-white rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <Table className="min-w-full text-sm">
          <TableCaption>A list of your items.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer p-1 text-gray-600 hover:text-gray-800">
                        <span className="text-lg font-semibold">...</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-2">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
