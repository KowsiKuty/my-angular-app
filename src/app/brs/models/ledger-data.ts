export interface LedgerData {
    id(id: any): void;
    // id:number,
    gl_date:Date,
    branch_code: string,
    line_description: string,
    gl_doc_no: string,
    // category: string,
    debit_amount: string,
    credit_amount: string,
    select: '',
}
