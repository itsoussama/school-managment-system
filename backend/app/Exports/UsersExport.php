<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UsersExport implements FromCollection, WithHeadings, WithStyles
{
    protected $filters;

    // Accept filters via the constructor
    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    /**
    * @return \Illuminate\Support\Collection
    */

    public function collection()
    {
        $query = User::query();

        // Apply filters
        if (!empty($this->filters['name'])) {
            $query->where('name', 'like', '%' . $this->filters['name'] . '%');
        }

        if (!empty($this->filters['email'])) {
            $query->where('email', 'like', '%' . $this->filters['email'] . '%');
        }
        return $query->get(['name', 'email']);
    }
    public function headings(): array
    {
        return [
            'Name',
            'Email',
        ];
    }
    public function styles(Worksheet $sheet)
    {
        $headerRow = 1;
        $sheet->getStyle("A{$headerRow}:B{$headerRow}")->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14,
                'color' => ['argb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => '4F81BD'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => '000000'],
                ],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Apply styles to the data rows
        $sheet->getStyle('A2:B' . $sheet->getHighestRow())->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => '000000'],
                ],
            ],
        ]);

        foreach (range('A', 'B') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }
}
