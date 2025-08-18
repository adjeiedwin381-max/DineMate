import Swal from 'sweetalert2';
import logo from '../assets/logo.jpeg';
import useMenuStore from "../lib/menuStore";
import { database_logs } from '../lib/logActivities';

const noItemsWarning = () => {Swal.fire({title: "No items to print!", icon: "warning",})};

// Calculate the dynamic window height based on items and extra details
const calculatedHeight = (orderItems) => {
    const baseHeight = 300; // Height for header, footer, and extra details after table
    const itemHeight = 30; // Estimated height per item row
    const calculatedHeight = baseHeight + orderItems.length * itemHeight;

    return calculatedHeight 
};

// Generate the HTML content for the bill print window
export const printBillOnly = async (orderId, waiterName, chosenTable, totalOrdersQty, totalOrdersPrice, orderItems) => {
    const { updatePrintedBillStatus } = useMenuStore.getState();

    if (!orderItems || orderItems.length === 0) {
        noItemsWarning();
        return;
    }

    // Open a new window
    const printWindow = window.open('', '', `width=315,height=${calculatedHeight(orderItems)}`);

    // Generate the HTML content
    const htmlContent = generatePrintHTML(orderId, waiterName, chosenTable, totalOrdersQty, totalOrdersPrice, orderItems);

    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.writeln(htmlContent);
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
    printWindow.close();
    
    // Set isBillPrinted to true after printing
    useMenuStore.getState().setBillPrinted(true);

    const details = {
        "orderId" : orderId,
        "table" : chosenTable,
        "totalAmount" : totalOrdersPrice
    };

    database_logs(waiterName, "BILL_PRINTED", details);

    // Update the printed status in the state and database
    await updatePrintedBillStatus(orderId);
};

// Generate the HTML content for the RECEIPT print window
export const printReceipt = async (orderId, waiterName, chosenTable, totalOrdersQty, totalOrdersPrice, orderItems, totalPaid, cashValue, cardValue, change) => {
    if (!orderItems || orderItems.length === 0) {
        noItemsWarning();
        return;
    }

    // Open a new window
    const printWindow = window.open('', '', `width=315,height=${calculatedHeight(orderItems)}`);

    // Generate the HTML content
    const htmlContent = generatePrintReceiptHTML(orderId, waiterName, chosenTable, totalOrdersQty, totalOrdersPrice, orderItems, totalPaid, cashValue, cardValue, change);
    
    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.writeln(htmlContent);
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
    printWindow.close();
};

export const printForKitchen = async (orderId, waiterName, chosenTable, orderItems) => {
    const { updatePrintedStatus } = useMenuStore.getState();

    if (!orderItems || orderItems.length === 0) {
        noItemsWarning();
        return;
    }

    // Open a new window
    const printWindow = window.open('', '', `width=315,height=${calculatedHeight(orderItems)}`);

    // Create the HTML content
    const htmlContent = generateKitchenPrintHTML(orderId, waiterName, chosenTable, orderItems);

    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.writeln(htmlContent);
    printWindow.document.close();

    // Trigger the print dialog
    printWindow.print();
    printWindow.close();

    const details = {
        "order ID" : orderId,
        "Table Number" : chosenTable 
    };

    database_logs(waiterName, "PRINTED_FOR_KITCHEN", details);

    // Update the printed status in the state and database
    await updatePrintedStatus(orderId);
};

// Function to generate the HTML content for the print window
const generatePrintHTML = (orderId, waiterName, chosenTable, totalOrdersQty, totalOrdersPrice, orderItems) => {
    const rows = orderItems.map((item) => {
        if (item?.menuItems?.type === 'food' && !item?.menuItems?.description) {
            return `
                <tr>
                    <td><strong>${item.menuItems.item_name.toUpperCase()}</strong></td>
                    <td><strong>${item.menuItems.price}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                    <td><strong>${item.total}</strong></td>
                </tr>
            `;
        } else if (item?.menuItems?.type === 'food' && item?.menuItems?.description) {
            return `
                <tr>
                    <td><strong>${item.menuItems.item_name.toUpperCase()} ${item.menuItems.description.toUpperCase()}</strong></td>
                    <td><strong>${item.menuItems.price}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                    <td><strong>${item.total}</strong></td>
                </tr>
            `;
        } else if (item?.drinks?.type === 'drink') {
            return `
                <tr>
                    <td><strong>${item.drinks.name.toUpperCase()}</strong></td>
                    <td><strong>${item.drinks.price}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                    <td><strong>${item.total}</strong></td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td colspan="4">Item data is missing</td>
                </tr>
            `;
        }
    }).join('');

    return `
        <html>
            <head>
                <title>Print Bill</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <div class="text-center">
                    <img src="${logo}" alt="Your Logo" width="150" height="150">
                </div>
                <h4 class="text-center"><strong>Annys Restaurant & Bar</strong></h4>
                <h6 class="text-center"><strong><em>CUSTOMER BILL</em></strong></h6>
                <p><strong>Order No: ${orderId}<br/> Waiter: ${waiterName}<br/>TABLE: ${chosenTable || 'N/A'}</strong></p>
                <table class="table table-bordered border-dark">
                    <thead class="table-dark">
                        <tr>
                            <th>Product</th>
                            <th>Price(£)</th>
                            <th>Qty</th>
                            <th>Total(£)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2"><h6>Total</h6></td>
                            <td><strong>${totalOrdersQty}</strong></td>
                            <td><strong>&#163; ${totalOrdersPrice}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="3"><h6>Discount</h6></td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td colspan="3"><h6>Grand Total</h6></td>
                            <td><strong>&#163; ${totalOrdersPrice}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <p><small><em><strong>NB: THIS IS NOT AN OFFICIAL PAYMENT RECEIPT... PLEASE INSIST ON GETTING RECEIPT AFTER PAYMENT</strong></em></small></p>
            </body>
        </html>
    `;
};

const generatePrintReceiptHTML = (orderId, waiterName, chosenTable, totalOrdersQty, totalOrdersPrice, orderItems, totalPaid, cashValue, cardValue, change) => {
    const rows = orderItems.map((item) => {
        if (item?.menuItems?.type === 'food' && !item?.menuItems?.description) {
            return `
                <tr>
                    <td><strong>${item.menuItems.item_name.toUpperCase()}</strong></td>
                    <td><strong>${item.menuItems.price}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                    <td><strong>${item.total}</strong></td>
                </tr>
            `;
        } else if (item?.menuItems?.type === 'food' && item?.menuItems?.description) {
            return `
                <tr>
                    <td><strong>${item.menuItems.item_name.toUpperCase()} ${item.menuItems.description.toUpperCase()}</strong></td>
                    <td><strong>${item.menuItems.price}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                    <td><strong>${item.total}</strong></td>
                </tr>
            `;
        } else if (item?.drinks?.type === 'drink') {
            return `
                <tr>
                    <td><strong>${item.drinks.name.toUpperCase()}</strong></td>
                    <td><strong>${item.drinks.price}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                    <td><strong>${item.total}</strong></td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td colspan="4">Item data is missing</td>
                </tr>
            `;
        }
    }).join('');

    return `
        <html>
            <head>
                <title>Print Bill</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <div class="text-center">
                    <img src="${logo}" alt="Your Logo" width="150" height="150">
                </div>
                <h4 class="text-center"><strong>Annys Restaurant & Bar</strong></h4>
                <h6 class="text-center"><strong><em>OFFICIAL RECEIPT</em></strong></h6>
                <p><strong>Order No: ${orderId}<br/> Waiter: ${waiterName}<br/>TABLE: ${chosenTable || 'N/A'}</strong></p>
                <table class="table table-bordered border-dark">
                    <thead class="table-dark">
                        <tr>
                            <th>Product</th>
                            <th>Price(£)</th>
                            <th>Qty</th>
                            <th>Total(£)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2"><h6>Grand Total</h6></td>
                            <td><strong>${totalOrdersQty}</strong></td>
                            <td><strong>&#163; ${totalOrdersPrice}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="3"><h6>Total Cash Paid</h6></td>
                            <td>&#163; ${cashValue}</td>
                        </tr>
                        <tr>
                            <td colspan="3"><h6>Total Card Paid</h6></td>
                            <td>&#163; ${cardValue}</td>
                        </tr>
                        <tr>
                            <td colspan="3"><h6>Total Amount Paid</h6></td>
                            <td>&#163; ${totalPaid}</td>
                        </tr>
                        <tr>
                            <td colspan="3"><h6>Change</h6></td>
                            <td><strong>&#163; ${change}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <p><small><em><strong>THANK YOU! VISIT US AGAIN SOON. </strong></em></small></p>
            </body>
        </html>
    `;
};

// Function to generate the HTML content for the kitchen print
const generateKitchenPrintHTML = (orderId, waiterName, chosenTable, orderItems) => {
    const rows = orderItems.map((item) => {
        if (item?.menuItems?.type === 'food') {
            return `
                <tr>
                    <td><strong>${item.menuItems.item_name.toUpperCase()} ${item.menuItems.description.toUpperCase()}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                </tr>
            `;
        } else if (item?.menuItems?.type === 'food' && item?.menuItems?.description) {
            return `
                <tr>
                    <td><strong>${item.menuItems.item_name.toUpperCase()}</strong></td>
                    <td><strong>${item.quantity}</strong></td>
                </tr>
            `;
        } else {
            return null;
        }
    }).join('');

    return `
        <html>
            <head>
                <title>Print Kitchen Orders</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <div class="text-center">
                    <img src="${logo}" alt="Your Logo" width="150" height="150">
                </div>
                <h4 class="text-center"><strong>Annys Restaurant & Bar</strong></h4>
                <p><strong>ORDER NO: ${orderId}<br/> SERVED BY: ${waiterName}<br/>TABLE: ${chosenTable || 'N/A'}</strong></p>
                <table class="table table-bordered border-dark">
                    <thead class="table-dark">
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </body>
        </html>
    `;
};

