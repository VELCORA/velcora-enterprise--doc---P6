import { SampleDocumentTemplate } from '../types';

export const SAMPLE_DOCUMENTS: SampleDocumentTemplate[] = [
  {
    id: 'sample-inv-001',
    title: 'Enterprise Server Fleet Purchase Invoice',
    category: 'Invoice',
    description: 'Hardware equipment invoice from Acme Tech Solutions with multi-item breakdown, sales tax, and NET 30 terms.',
    fileName: 'INV-2026-8849_AcmeTech.pdf',
    fileSize: '412 KB',
    fileType: 'application/pdf',
    sampleText: `ACME TECH SOLUTIONS INC.
100 Innovation Way, Suite 400, San Francisco, CA 94105
Tax ID: US-994820194 | Phone: +1 (800) 555-0199 | billing@acmetech.io

INVOICE #: INV-2026-8849
Invoice Date: August 10, 2026
Due Date: September 09, 2026
PO Number: PO-99201-TECH
Payment Terms: NET 30

BILL TO:
Velcora Global Corp
750 Cybernetic Way, Tech District, Austin, TX 78701
Account ID: VEL-88190

DESCRIPTION                                    QTY    UNIT PRICE     AMOUNT
-----------------------------------------------------------------------------
Velcora-Custom AI Edge GPU Node Model X1       4      $3,500.00     $14,000.00
Enterprise Storage Bay 100TB High Speed SSD    2      $1,800.00      $3,600.00
On-Site Technical Deployment & Rigging         1      $1,250.00      $1,250.00
-----------------------------------------------------------------------------
Subtotal:                                                           $18,850.00
Discount (Partner Program 5%):                                       -$942.50
Net Subtotal:                                                       $17,907.50
Estimated Sales Tax (8.25%):                                         $1,477.37
TOTAL AMOUNT DUE:                                                   $19,384.87

Bank Wire Details:
Bank of America | Routing: 121000358 | Account: 99482019284
Note: Early payment discount of 2% applies if paid within 10 days.`,
    preExtractedData: {
      documentType: 'Invoice',
      confidenceScore: 98.6,
      processingTimeMs: 1140,
      summary: 'High-value hardware invoice from Acme Tech Solutions for 4 AI Edge GPU Nodes and SSD storage bays totaling $19,384.87 with NET 30 terms.',
      vendorInfo: {
        name: 'Acme Tech Solutions Inc.',
        address: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
        taxId: 'US-994820194',
        phone: '+1 (800) 555-0199',
        email: 'billing@acmetech.io',
        website: 'www.acmetech.io'
      },
      customerInfo: {
        name: 'Velcora Global Corp',
        address: '750 Cybernetic Way, Tech District, Austin, TX 78701',
        accountId: 'VEL-88190'
      },
      financials: {
        invoiceNumber: 'INV-2026-8849',
        poNumber: 'PO-99201-TECH',
        documentDate: '2026-08-10',
        dueDate: '2026-09-09',
        paymentTerms: 'NET 30',
        currency: 'USD',
        subtotal: 18850.00,
        taxAmount: 1477.37,
        discountAmount: 942.50,
        totalAmount: 19384.87
      },
      lineItems: [
        {
          id: 'item-1',
          itemCode: 'GPU-NODE-X1',
          description: 'Velcora-Custom AI Edge GPU Node Model X1',
          quantity: 4,
          unitPrice: 3500.00,
          amount: 14000.00,
          category: 'Hardware'
        },
        {
          id: 'item-2',
          itemCode: 'SSD-BAY-100TB',
          description: 'Enterprise Storage Bay 100TB High Speed SSD',
          quantity: 2,
          unitPrice: 1800.00,
          amount: 3600.00,
          category: 'Hardware'
        },
        {
          id: 'item-3',
          itemCode: 'SVC-DEPLOY',
          description: 'On-Site Technical Deployment & Rigging',
          quantity: 1,
          unitPrice: 1250.00,
          amount: 1250.00,
          category: 'Services'
        }
      ],
      anomalies: [
        {
          id: 'anom-1',
          severity: 'medium',
          field: 'taxAmount',
          issue: 'Tax calculated on Net Subtotal ($17,907.50 * 8.25%) equals $1,477.37. Verify tax exemption eligibility for out-of-state hardware drop-shipment.',
          recommendation: 'Check Tax Exemption Certificate for Texas delivery location.'
        }
      ],
      keyClauses: [
        '2% early payment discount if paid within 10 days of invoice date.',
        'Net 30 standard payment terms with wire transfer instructions included.'
      ],
      actionableTriggers: [
        {
          id: 'trig-1',
          ruleName: 'High Value Invoice Approval (> $10,000)',
          actionType: 'approval',
          targetSystem: 'Velcora Finance Portal',
          priority: 'high',
          status: 'triggered',
          executedAt: '2026-08-13 05:50:12',
          details: 'Routed to CFO queue for sign-off prior to scheduled wire transfer.'
        },
        {
          id: 'trig-2',
          ruleName: 'Auto-Sync to QuickBooks ERP',
          actionType: 'erp_sync',
          targetSystem: 'QuickBooks Online API',
          priority: 'medium',
          status: 'triggered',
          executedAt: '2026-08-13 05:50:13',
          details: 'Draft accounts payable voucher created under vendor Acme Tech Solutions.'
        }
      ]
    }
  },

  {
    id: 'sample-po-002',
    title: 'Global Logistics Supply Chain Purchase Order',
    category: 'Purchase Order',
    description: 'International supply chain purchase order with customs codes, freight forwarding terms, and multiple shipping batches.',
    fileName: 'PO_77391_NexusLogistics.pdf',
    fileSize: '328 KB',
    fileType: 'application/pdf',
    sampleText: `NEXUS LOGISTICS INTERNATIONAL
Freight Tower, Level 12, Seattle, WA 98101
Tax ID: US-781902341 | Contact: ops@nexuslogistics.global

PURCHASE ORDER: PO-77391-GL
PO Issue Date: August 02, 2026
Requested Delivery Date: August 25, 2026
Incoterms: DDP (Delivered Duty Paid - Austin HQ)

VENDOR:
Precision Microchip Fabrication Ltd
12 Silicon Parkway, Hsinchu Science Park, Taiwan
Tax Reg: TW-88392019

LINE ITEMS:
1. Microcontroller Chipset V-4 (Qty: 2,500 @ $4.50 ea) -> $11,250.00
2. Thermal Sensor Modules TS-90 (Qty: 1,000 @ $2.25 ea) -> $2,250.00
3. Expedited Air Freight & Customs Brokerage (Flat Fee) -> $1,800.00

TOTAL ESTIMATED COST: $15,300.00 USD
Currency: USD

Special Instructions:
- All packages must bear barcode shipping label format GS1-128.
- Certificate of Conformance (CoC) must accompany packing slip.`,
    preExtractedData: {
      documentType: 'Purchase Order',
      confidenceScore: 99.2,
      processingTimeMs: 980,
      summary: 'Purchase Order PO-77391-GL issued to Precision Microchip Fabrication for $15,300.00 under DDP delivery terms by August 25, 2026.',
      vendorInfo: {
        name: 'Precision Microchip Fabrication Ltd',
        address: '12 Silicon Parkway, Hsinchu Science Park, Taiwan',
        taxId: 'TW-88392019',
        email: 'sales@microchipfab.tw',
        website: 'www.microchipfab.tw'
      },
      customerInfo: {
        name: 'Nexus Logistics International',
        address: 'Freight Tower, Level 12, Seattle, WA 98101',
        accountId: 'NEX-901'
      },
      financials: {
        invoiceNumber: 'PO-77391-GL',
        poNumber: 'PO-77391-GL',
        documentDate: '2026-08-02',
        dueDate: '2026-08-25',
        paymentTerms: 'DDP (Delivered Duty Paid)',
        currency: 'USD',
        subtotal: 15300.00,
        taxAmount: 0.00,
        discountAmount: 0.00,
        totalAmount: 15300.00
      },
      lineItems: [
        {
          id: 'item-1',
          itemCode: 'MCU-V4',
          description: 'Microcontroller Chipset V-4',
          quantity: 2500,
          unitPrice: 4.50,
          amount: 11250.00,
          category: 'Components'
        },
        {
          id: 'item-2',
          itemCode: 'TS-90',
          description: 'Thermal Sensor Modules TS-90',
          quantity: 1000,
          unitPrice: 2.25,
          amount: 2250.00,
          category: 'Components'
        },
        {
          id: 'item-3',
          itemCode: 'FREIGHT-AIR',
          description: 'Expedited Air Freight & Customs Brokerage',
          quantity: 1,
          unitPrice: 1800.00,
          amount: 1800.00,
          category: 'Logistics'
        }
      ],
      anomalies: [
        {
          id: 'anom-1',
          severity: 'low',
          field: 'taxAmount',
          issue: 'DDP terms require vendor to absorb customs duties. Confirm import tax clearance documents upon receipt.',
          recommendation: 'Cross-check Certificate of Conformance (CoC) with packing list.'
        }
      ],
      keyClauses: [
        'Mandatory GS1-128 barcode format on all pallets.',
        'Delivery required on or before August 25, 2026.'
      ],
      actionableTriggers: [
        {
          id: 'trig-1',
          ruleName: 'Inventory Pre-Registration',
          actionType: 'webhook',
          targetSystem: 'SAP Supply Chain WMS',
          priority: 'medium',
          status: 'triggered',
          executedAt: '2026-08-13 05:51:00',
          details: 'Pre-registered 2,500 MCU chips and 1,000 thermal sensors in inbound shipment queue.'
        }
      ]
    }
  },

  {
    id: 'sample-contract-003',
    title: 'Commercial Office Space Lease Agreement',
    category: 'Commercial Contract',
    description: 'Real estate lease contract with rental schedule, annual escalation, maintenance responsibilities, and security deposit.',
    fileName: 'Lease_VelcoraHQ_VelcoraProperties.pdf',
    fileSize: '580 KB',
    fileType: 'application/pdf',
    sampleText: `COMMERCIAL LEASE AGREEMENT SUMMARY
Lessor: Velcora Properties LLC | Lessee: Velcora Global Corp
Property Location: 750 Cybernetic Way, Suites 400-500, Austin, TX 78701
Total Rentable Area: 12,500 Sq. Ft.

TERM & COMMENCEMENT:
Initial Term: 36 Months
Commencement Date: September 01, 2026 | Expiration Date: August 31, 2029

FINANCIAL TERMS:
Base Rent: $32.00 / Sq. Ft. / Year ($33,333.33 / Month)
Annual Rent Escalation: 3.5% annually on each anniversary date
Security Deposit: $66,666.66 (2 Months Base Rent)
Triple Net (NNN) Estimated Expenses: $6.50 / Sq. Ft. ($6,770.83 / Month)

TOTAL MONTHLY COMMITMENT: $40,104.16 USD
Due Date: 1st day of each calendar month (5-day grace period, 5% late fee thereafter)

Maintenance & Utilities Responsibilities:
- Landlord: Roof, structural foundation, external building envelope.
- Tenant: HVAC maintenance contract, interior utilities,janitorial, internet.`,
    preExtractedData: {
      documentType: 'Commercial Contract',
      confidenceScore: 97.8,
      processingTimeMs: 1420,
      summary: '3-year commercial office lease agreement with Velcora Properties LLC for 12,500 sq ft at $40,104.16 monthly total commitment including NNN expenses.',
      vendorInfo: {
        name: 'Velcora Properties LLC',
        address: '750 Cybernetic Way, Suite 100, Austin, TX 78701',
        phone: '+1 (512) 555-0812',
        email: 'leasing@velcoraproperties.com'
      },
      customerInfo: {
        name: 'Velcora Global Corp',
        address: '750 Cybernetic Way, Suites 400-500, Austin, TX 78701'
      },
      financials: {
        invoiceNumber: 'LEASE-AUSTIN-2026',
        poNumber: 'N/A',
        documentDate: '2026-08-01',
        dueDate: '2026-09-01',
        paymentTerms: 'Monthly Due on 1st',
        currency: 'USD',
        subtotal: 33333.33,
        taxAmount: 0.00,
        discountAmount: 0.00,
        totalAmount: 40104.16
      },
      lineItems: [
        {
          id: 'item-1',
          description: 'Base Monthly Rent (12,500 sq ft @ $32.00/sq ft/yr)',
          quantity: 1,
          unitPrice: 33333.33,
          amount: 33333.33,
          category: 'Occupancy'
        },
        {
          id: 'item-2',
          description: 'NNN Estimated Operating Expenses ($6.50/sq ft/yr)',
          quantity: 1,
          unitPrice: 6770.83,
          amount: 6770.83,
          category: 'CAM & Taxes'
        }
      ],
      anomalies: [
        {
          id: 'anom-1',
          severity: 'medium',
          field: 'annualEscalation',
          issue: 'Contract includes 3.5% annual escalation starting Sept 01, 2027. Calendar reminder required for budget adjustment.',
          recommendation: 'Schedule automatic ERP lease indexation alert for July 2027.'
        }
      ],
      keyClauses: [
        '36-month lease duration expiring August 31, 2029.',
        'Security deposit of $66,666.66 due upon signing.',
        'Tenant responsible for interior HVAC maintenance agreement.'
      ],
      actionableTriggers: [
        {
          id: 'trig-1',
          ruleName: 'Recurring Lease Expense Schedule',
          actionType: 'erp_sync',
          targetSystem: 'Workday Financials',
          priority: 'high',
          status: 'triggered',
          executedAt: '2026-08-13 05:51:30',
          details: 'Created 36-month scheduled recurring payment voucher of $40,104.16 due on 1st of month.'
        }
      ]
    }
  },

  {
    id: 'sample-receipt-004',
    title: 'Executive Client Dinner & Travel Expense Receipt',
    category: 'Receipt',
    description: 'Restaurant expense receipt from Ocean Prime Grill with itemized food & beverage charges, tip, and employee expense policy check.',
    fileName: 'Receipt_OceanPrime_Dinner.jpg',
    fileSize: '195 KB',
    fileType: 'image/jpeg',
    sampleText: `OCEAN PRIME FINE STEAK & SEAFOOD
400 Colorado St, Austin, TX 78701
Server: Marcus P. | Table: 14 | Guest Count: 4
Date: 08/11/2026  8:45 PM  Receipt #: 902811

4 x Prime Filet Mignon 10oz @ $68.00         $272.00
2 x Chilean Sea Bass @ $58.00                $116.00
1 x Napa Valley Cabernet Sauvignon Bottle    $180.00
4 x Chef Artisanal Dessert @ $16.00           $64.00
---------------------------------------------------
Subtotal:                                    $632.00
State & City Tax (8.25%):                     $52.14
Gratuity / Tip (20%):                        $126.40
---------------------------------------------------
TOTAL PAID (Visa ending 4902):              $810.54

Cardholder: Johnathan V. (VP Sales)
Purpose: Q3 Executive Client Dinner - Acme Tech Partnership`,
    preExtractedData: {
      documentType: 'Receipt',
      confidenceScore: 99.5,
      processingTimeMs: 820,
      summary: 'Client dinner expense receipt at Ocean Prime Austin for $810.54 paid by Johnathan V. for 4 guests.',
      vendorInfo: {
        name: 'Ocean Prime Fine Steak & Seafood',
        address: '400 Colorado St, Austin, TX 78701',
        phone: '+1 (512) 555-9011'
      },
      customerInfo: {
        name: 'Johnathan V. (Velcora VP Sales)'
      },
      financials: {
        invoiceNumber: 'RCPT-902811',
        poNumber: 'EXP-SALES-2026-Q3',
        documentDate: '2026-08-11',
        dueDate: '2026-08-11',
        paymentTerms: 'Credit Card (Visa **4902)',
        currency: 'USD',
        subtotal: 632.00,
        taxAmount: 52.14,
        discountAmount: 0.00,
        totalAmount: 810.54
      },
      lineItems: [
        {
          id: 'item-1',
          description: 'Prime Filet Mignon 10oz',
          quantity: 4,
          unitPrice: 68.00,
          amount: 272.00,
          category: 'Meals & Entertainment'
        },
        {
          id: 'item-2',
          description: 'Chilean Sea Bass',
          quantity: 2,
          unitPrice: 58.00,
          amount: 116.00,
          category: 'Meals & Entertainment'
        },
        {
          id: 'item-3',
          description: 'Napa Valley Cabernet Sauvignon Bottle',
          quantity: 1,
          unitPrice: 180.00,
          amount: 180.00,
          category: 'Alcohol / Beverage'
        },
        {
          id: 'item-4',
          description: 'Chef Artisanal Dessert',
          quantity: 4,
          unitPrice: 16.00,
          amount: 64.00,
          category: 'Meals & Entertainment'
        }
      ],
      anomalies: [
        {
          id: 'anom-1',
          severity: 'low',
          field: 'lineItems.alcohol',
          issue: 'Alcohol expense of $180.00 included. Complies with Executive Client Hospitality tier policy (limit $250/meal).',
          recommendation: 'Attach list of client attendee names before reimbursement submission.'
        }
      ],
      keyClauses: [
        'Receipt fully paid via Visa ****4902.',
        'Per-person meal average: $202.63 across 4 attendees.'
      ],
      actionableTriggers: [
        {
          id: 'trig-1',
          ruleName: 'Auto-Forward Expense Claim',
          actionType: 'email',
          targetSystem: 'Concur Expense Engine',
          priority: 'low',
          status: 'triggered',
          executedAt: '2026-08-13 05:52:10',
          details: 'Expense claim draft populated with vendor, date, category, and total amount.'
        }
      ]
    }
  }
];
