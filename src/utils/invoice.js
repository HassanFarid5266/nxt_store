export class InvoiceGenerator {
    static generateInvoiceHTML(order, items = []) {
        const invoiceData = {
            invoiceNumber: `INV-${order.id}`,
            orderNumber: order.id,
            invoiceDate: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            orderDate: new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            dueDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        };

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceData.invoiceNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            padding: 20px;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .invoice-header {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 2rem;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .company-info h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .company-info p {
            opacity: 0.9;
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-meta h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .invoice-meta p {
            margin-bottom: 0.25rem;
            opacity: 0.9;
        }
        
        .invoice-body {
            padding: 2rem;
        }
        
        .billing-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .billing-info h3 {
            color: #007bff;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            border-bottom: 2px solid #007bff;
            padding-bottom: 0.5rem;
        }
        
        .billing-info p {
            margin-bottom: 0.25rem;
            color: #555;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .items-table th {
            background: #f8f9fa;
            color: #495057;
            font-weight: 600;
            padding: 1rem;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
        }
        
        .items-table td {
            padding: 1rem;
            border-bottom: 1px solid #dee2e6;
        }
        
        .items-table tr:last-child td {
            border-bottom: none;
        }
        
        .items-table tr:hover {
            background: #f8f9fa;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .font-weight-bold {
            font-weight: bold;
        }
        
        .summary-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 2rem;
        }
        
        .summary-table {
            min-width: 300px;
        }
        
        .summary-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #dee2e6;
        }
        
        .summary-table tr:last-child {
            background: #007bff;
            color: white;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .summary-table tr:last-child td {
            border-bottom: none;
        }
        
        .payment-info {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        .payment-info h3 {
            color: #007bff;
            margin-bottom: 1rem;
        }
        
        .payment-status {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.875rem;
        }
        
        .status-paid {
            background: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        
        .footer-notes {
            background: #f8f9fa;
            padding: 1.5rem;
            border-top: 3px solid #007bff;
            margin-top: 2rem;
        }
        
        .footer-notes h3 {
            color: #007bff;
            margin-bottom: 1rem;
        }
        
        .footer-notes p {
            color: #6c757d;
            margin-bottom: 0.5rem;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .invoice-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
        
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 1rem;
            }
            
            .invoice-meta {
                text-align: left;
            }
            
            .billing-section {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .items-table {
                font-size: 0.875rem;
            }
            
            .items-table th,
            .items-table td {
                padding: 0.75rem 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="header-content">
                <div class="company-info">
                    <h1>NXT Store</h1>
                    <p>Your Premium Shopping Destination</p>
                    <p>123 Business Street, Suite 100</p>
                    <p>Business City, BC 12345</p>
                    <p>Email: billing@nxtstore.com</p>
                    <p>Phone: (555) 123-4567</p>
                </div>
                <div class="invoice-meta">
                    <h2>INVOICE</h2>
                    <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber
            }</p>
                    <p><strong>Order #:</strong> ${invoiceData.orderNumber}</p>
                    <p><strong>Invoice Date:</strong> ${invoiceData.invoiceDate
            }</p>
                    <p><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
                </div>
            </div>
        </div>

        <div class="invoice-body">
            <div class="billing-section">
                <div class="billing-info">
                    <h3>Bill To</h3>
                    <p><strong>${order.customer_name ||
            `${order.first_name} ${order.last_name}`
            }</strong></p>
                    <p>${order.email}</p>
                    <p>${order.phone}</p>
                    <p>${order.address_1 || order.shipping_address?.city || ""
            }</p>
                    ${order.address_2 ? `<p>${order.address_2}</p>` : ""}
                    <p>${order.city || order.shipping_address?.city || ""}, ${order.state || ""
            } ${order.postal_code || ""}</p>
                    <p>${order.country || order.shipping_address?.country || ""
            }</p>
                </div>
                <div class="billing-info">
                    <h3>Order Details</h3>
                    <p><strong>Order Date:</strong> ${invoiceData.orderDate}</p>
                    <p><strong>Payment Method:</strong> ${this.formatPaymentMethod(
                order.payment_method
            )}</p>
                    ${order.payment_id
                ? `<p><strong>Payment ID:</strong> ${order.payment_id}</p>`
                : ""
            }
                    ${order.tracking_number
                ? `<p><strong>Tracking #:</strong> ${order.tracking_number}</p>`
                : ""
            }
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items
                .map(
                    (item) => `
                        <tr>
                            <td>
                                <strong>${item.product_title || item.title
                        }</strong>
                                ${item.variation
                            ? `<br><small>Variation: ${item.variation}</small>`
                            : ""
                        }
                            </td>
                            <td class="text-center">${item.quantity || 1}</td>
                            <td class="text-right">$${parseFloat(
                            item.price
                        ).toFixed(2)}</td>
                            <td class="text-right">$${(
                            parseFloat(item.price) * (item.quantity || 1)
                        ).toFixed(2)}</td>
                        </tr>
                    `
                )
                .join("")}
                </tbody>
            </table>

            <div class="summary-section">
                <table class="summary-table">
                    <tr>
                        <td><strong>Subtotal:</strong></td>
                        <td class="text-right">$${parseFloat(
                    order.subtotal || order.sub_total
                ).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Tax:</strong></td>
                        <td class="text-right">$${parseFloat(order.tax).toFixed(
                    2
                )}</td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL:</strong></td>
                        <td class="text-right">$${parseFloat(
                    order.total
                ).toFixed(2)}</td>
                    </tr>
                </table>
            </div>

            <div class="payment-info">
                <h3>Payment Information</h3>
                <p><strong>Status:</strong> 
                    <span class="payment-status ${order.status === "pending"
                ? "status-pending"
                : "status-paid"
            }">
                        ${order.status === "pending"
                ? "Pending Payment"
                : "Paid"
            }
                    </span>
                </p>
                <p><strong>Payment Method:</strong> ${this.formatPaymentMethod(
                order.payment_method
            )}</p>
                ${order.payment_id
                ? `<p><strong>Transaction ID:</strong> ${order.payment_id}</p>`
                : ""
            }
            </div>
        </div>

        <div class="footer-notes">
            <h3>Terms & Conditions</h3>
            <p>• Payment is due within 30 days of invoice date</p>
            <p>• Please include invoice number with payment</p>
            <p>• For questions about this invoice, contact us at billing@nxtstore.com</p>
            <p>• Thank you for your business!</p>
        </div>
    </div>
</body>
</html>
    `;
    }

    static formatPaymentMethod(method) {
        const methods = {
            card: "Credit/Debit Card",
            "bank-account": "Bank Transfer",
            paypal: "PayPal",
            "wire-transfer": "Wire Transfer",
        };
        return methods[method] || method;
    }

    static async downloadInvoice(order, items = []) {
        try {
            const htmlContent = this.generateInvoiceHTML(order, items);

            // Create and download HTML file
            const blob = new Blob([htmlContent], { type: "text/html" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${order.id}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            return { success: true, message: "Invoice downloaded successfully" };
        } catch (error) {
            console.error("Error generating invoice:", error);
            return { success: false, message: "Error generating invoice" };
        }
    }

    static async printInvoice(order, items = []) {
        try {
            const htmlContent = this.generateInvoiceHTML(order, items);

            // Open in new window for printing
            const printWindow = window.open("", "_blank");
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();

            // Auto-print after content loads
            printWindow.onload = () => {
                printWindow.print();
            };

            return { success: true, message: "Invoice opened for printing" };
        } catch (error) {
            console.error("Error printing invoice:", error);
            return { success: false, message: "Error printing invoice" };
        }
    }

    static generateReceipt(order, items = []) {
        const receiptData = {
            receiptNumber: `RCP-${order.id}`,
            date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        let receipt = `
═══════════════════════════════════════
              NXT STORE
         Purchase Receipt
═══════════════════════════════════════

Receipt #: ${receiptData.receiptNumber}
Order #: ${order.id}
Date: ${receiptData.date}

Customer: ${order.customer_name || `${order.first_name} ${order.last_name}`}
Email: ${order.email}

═══════════════════════════════════════
                ITEMS
═══════════════════════════════════════

`;

        items.forEach((item) => {
            const itemTotal = (parseFloat(item.price) * (item.quantity || 1)).toFixed(
                2
            );
            receipt += `${item.product_title || item.title}\n`;
            if (item.variation) {
                receipt += `  Variation: ${item.variation}\n`;
            }
            receipt += `  ${item.quantity || 1} x $${parseFloat(item.price).toFixed(
                2
            )} = $${itemTotal}\n\n`;
        });

        receipt += `═══════════════════════════════════════
                SUMMARY
═══════════════════════════════════════

Subtotal:               $${parseFloat(
            order.subtotal || order.sub_total
        ).toFixed(2)}
Tax:                    $${parseFloat(order.tax).toFixed(2)}
───────────────────────────────────────
TOTAL:                  $${parseFloat(order.total).toFixed(2)}

Payment Method: ${this.formatPaymentMethod(order.payment_method)}
${order.payment_id ? `Payment ID: ${order.payment_id}` : ""}
Status: ${order.status === "pending" ? "Pending Payment" : "Paid"}

═══════════════════════════════════════
Thank you for shopping with NXT Store!

Questions? Contact us:
Email: support@nxtstore.com
Phone: (555) 123-4567
═══════════════════════════════════════
`;

        return receipt;
    }

    static async downloadReceipt(order, items = []) {
        try {
            const receiptContent = this.generateReceipt(order, items);

            const blob = new Blob([receiptContent], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `receipt-${order.id}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            return { success: true, message: "Receipt downloaded successfully" };
        } catch (error) {
            console.error("Error generating receipt:", error);
            return { success: false, message: "Error generating receipt" };
        }
    }
}

export default InvoiceGenerator;
