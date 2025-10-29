import { query } from "@angular/animations";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

const url = environment.apiURL;

@Injectable({
  providedIn: "root",
})
export class FrsServiceService {
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}
  pprgetjsondata:any;

  public get_branch_code(query, pagenumber) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    if (query === null) {
      query = "";
    }
    let urlvalue =
      url +
      "usrserv/search_employeebranch?query=" +
      query +
      "&page=" +
      pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  
  public get_payment_type() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/payment_type";
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  public get_customer_type(Name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/customer_type?name=" + Name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public get_transcation_type() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/transaction_type";
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  frs_details(data,file) {
    console.log("datas",data,file)
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formdata:any = new FormData()    
    formdata.append("data", JSON.stringify(data));
    
    if (file !== null) {
      for (var i = 0; i < file.length; i++) { 
        formdata.append("file", file[i]);
      }
      console.log("i",i)
    }
    console.log("append data", )
    let urlvalue = url + "niserv/add_details";  
    this.spinner.show();
    return this.http
      .post(urlvalue, formdata, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      })
      .pipe(finalize(() => this.spinner.hide()));
  }
  frs_summary(income, page) {
    console.log("frs_summary(income, page)",income.from_date,page)
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let urlvalue = url + 'niserv/incomedetail_insert?page='+page;
    let urlvalue =
      url +
      "niserv/income_details?branch_id=" + income.branch_id +"&payment_type=" +
      income.payment_type +
      "&transaction_type=" +
      income.transaction_type +
      "&customer_type=" +
      income.customer_type +
      "&transationdetails=" +
      income.transationdetails +
      "&status=" +
      income.status +
      "&from_date=" +
      income.from_date +
      "&to_date=" +
      income.to_date +
      "&Flag=" +
      income.Flag +
      "&code="+
      income.code+
      "&cbs_status="+
      income.cbs_status+
      "&page="+
      page;     
    this.spinner.show();
    console.log("branch", income.branch_id)
    return this.http
      .get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      })
      .pipe(finalize(() => this.spinner.hide()));
  }
  frs_info(data, diff) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let urlvalue = url + 'niserv/incomedetail_insert?page='+page;
    let urlvalue;
    if (diff == "income") {
      urlvalue = url + "niserv/income_details/" + data.id;
    }
    if (diff == "trancation") {
      urlvalue =
        url + "niserv/transaction_details/" + data.incomedetails;
    }
    if (diff == "billingdetails") {
      urlvalue =
        url + "niserv/billing_details/" + data.transactiontype;
    }
    if (diff == "walkin") {
      urlvalue =
        url + "niserv/walkin_details/"+data.billingdetails;
    }
    this.spinner.show();
    return this.http
      .get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      })
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise();
  }
  frs_edit( param) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "niserv/edit_viewdetails", param, {
      headers: headers,
    });
  }
  frs_histry(incomedetails_id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/transaction_history/" + incomedetails_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  getStatedropdown(query, pagenumber) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue =
      url + "mstserv/state_search?query=" + query + "&page=" + pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  Statevalue() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/status_type";
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  Creditgl( quary,payment_id,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/gl_dropdown?payment_type=" +payment_id +"&query="+quary +"&page="+page ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  Approve_stats(Approve,file) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formdata:any = new FormData()    
    formdata.append("data", JSON.stringify(Approve));    
    if (file !== null) {
      for (var i = 0; i < file.length; i++) { 
        formdata.append("file", file[i]);
      }
      console.log("i",i)
    }
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "niserv/transaction_history", formdata, {
      headers: headers,
    });
  }
  Gstnumber(Depitegl) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "niserv/gst_inquery", Depitegl, {
      headers: headers,
    });
  }
  get_branch() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/employee_bankbranch";
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  getbs_dropdown(bsdata,page,gl) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/bs_gl?gl_id="+gl+"&page="+page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  getcc_dropdown(business_id,bsdata,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "pprservice/ppr_cc?businessid="+ business_id+"&query="+bsdata+"&page="+page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  frs_summarys_download(finyear) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "pprservice/budget_builder_filedownload?finyear="+ finyear+"&sectorid="+ '' +"&sectorname="+ '' + '&from_month' + '' + '&to_month' + "" + '&biz_nam' + '' + '&bsname' + '' + '&bsid' + '' + '&ccname' + '' + '&ccid' + '' + '&branch_id';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }      
  getProductdropdown(quary,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/product_details_dropdown?query="+quary+ "&page="+page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }               
  document(income_id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/incomedetails_files?Incomedetails="+ income_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }  
  downloadfiledocument(report_id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };   
    return this.http.get<any>(
      url + "niserv/attechment_download?file_id=" + report_id,     
      { headers: headers,responseType: 'blob' as 'json' }      
    );
   

  }    
  submit_document(report_id,file) {
    console.log("report_id",report_id)
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formdata:any = new FormData()    
    formdata.append("data", JSON.stringify(report_id));    
    if (file !== null) {
      for (var i = 0; i < file.length; i++) { 
        formdata.append("file", file[i]);
      }
      console.log("i",i)
    }
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "niserv/modify_attechments", formdata, {
      headers: headers,
    });
  }   
  delete_document(delete_values,status){
    console.log("delete_valuesfg",delete_values)
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "niserv/delete_attechments/" + delete_values + "?status=" + status,
      { headers: headers }
    );
  }  
  Catagorys(catdata,page){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "mstserv/categoryname_search?query="+ catdata + '&page=' + page;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }   
    Subcats(data,cat_id ,page){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "mstserv/subcatname_search?query="+ data +"&category_id="+ cat_id + "&page=" + page;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
      
    }     
    catsubcat_value(id){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "niserv/get_gl_details?gl_id="+id ;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }  
    
    public Admindownloadfiledocument(exception){
       console.log("loggg",exception)
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token     
      let urlvalue = url + 'niserv/generate_report_filedownload?branch_id='+exception.branch_id+'&payment_type='+exception.payment_type+'&transaction_type='+exception.transaction_type+'&customer_type='+exception.customer_type+'&transationdetails='+exception.transationdetails+'&status='+exception.status+'&from_date='+exception.from_date+'&to_date='+exception.to_date+'&Flag='+false+'&code='+exception.code+'&cbs_status='+exception.cbs_status; 
      return this.http.get(urlvalue,{
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }
   public get_trans_debit(trans_id){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/debit_gltype?trans_type="+trans_id ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
    }

    public frs_search(search_val,page){  
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let urlvalue = url + "niserv/doument_summary?status="+search_val.status+"&filename="+search_val.filename+"&created_date="+search_val.created_date+"&page="+page;
      return this.http.post<any>(urlvalue,{}, { 'headers': headers})
    }

    public frsreport(filekey){
      // this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      const headers = { 'Authorization': 'Token ' + token }
      let urlvalue=url+"niserv/download_Niifile?gen_key="+filekey
      return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
      )
    }

    debit_gl_type(){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "niserv/debit_type" ;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }
          
    query_summary(income,page){
      console.log("frs_summary(income, page)",income,page)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      // let urlvalue = url + 'niserv/incomedetail_insert?page='+page;
      let urlvalue =
        url + "niserv/fetchall_income_details?payment_type="+ income.payment_type + "&transaction_type="+income.transaction_type +"&customer_type=" +
        income.customer_type +  "&from_date=" +  income.from_date + "&to_date=" + income.to_date +"&code="+income.code+"&cbs_status="+ income.cbs_status+
        "&page="+ page;     
      this.spinner.show();
      return this.http
        .get(urlvalue, {
          headers: new HttpHeaders().set("Authorization", "Token " + token),
        })
        .pipe(finalize(() => this.spinner.hide()));
    }
    public Gst_in_api(gst_no){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "niserv/validate_gst?type=gst&value="+gst_no ;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }

    
  public get_reverse_branch_api() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/get_reverse_branches";
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
    
  public delete_particular_row(id){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "niserv/income_details/" + id + "?status=" + 14,
      { headers: headers }
    );
  }



  public gl_mapping_update(param,id,gl_id){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };   
   let urlvalue=   url + "niserv/update_doc_type?document_type=" + param + "&subcat_id=" + id +"&gl_id="+gl_id;     
    return this.http.post<any>(urlvalue,{}, { 'headers': headers})
  }

  public Credit_gl_mapping( query,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/general_ledger_summary?glno="+query+ "&page="+page ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  public getbranchdropdown(query,pagenumber) {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'usrserv/search_employeebranch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public reverse_create_update(param,file){
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
     let formdata:any = new FormData()    
    formdata.append("data", JSON.stringify(param));    
    if (file !== null) {
      for (var i = 0; i < file.length; i++) { 
        formdata.append("file", file[i]);
      }
      console.log("i",i)
    }
    // this.pprgetjsondata=file
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "niserv/create_reverse_branch",formdata, { 'headers': headers })
  }

  public reverse_summary_search(params,status,employee_id,flag,page){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/fetch_rev_branch?branch_code="+params+"&status="+ status +"&employee_id="+employee_id+"&flag="+flag+"&page="+page ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public reverse_file_fetch(id){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/incomedetails_files?Incomedetails="+id ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  public rever_delete(param,status){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "niserv/fetch_rev_branch?id=" + param + "&status=" + status,
      { headers: headers }
    );
  }
  
  public Subcat_api(quary,page){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url +"mstserv/apsubcat_summary?query=" +quary +"&page="+page+ "&flag="+"" ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  public gl_mapping_summary(subcat,gl_id,payment_type,page){   
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url +"niserv/fetch_dropdown_subcat?payment_type=" +payment_type +"&gl_id="+gl_id +"&id="+subcat +"&page="+page ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  
  public search_employee(quary,page){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url +"usrserv/searchemployee?query=" +quary +"&page="+page+ "&flag="+"" ;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  } 

  // rever_file_upload(file,create_id) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   // let formData = new FormData();
  //   // formData.append("file", file);
  //   let formdata:any = new FormData()    
  //   // formdata.append("data", JSON.stringify(report_id));    
  //   if (file !== null) {
  //     for (var i = 0; i < file.length; i++) { 
  //       formdata.append("file", file[i]);
  //     }
  //     console.log("i",i)
  //   }
  //   this.pprgetjsondata=file
  //   const headers = { Authorization: "Token " + token };
  //   return this.http.post<any>(url + "niserv/file_upload?reverse_branch_id="+create_id, formdata, {
  //     headers: headers,
  //   });
  // }  
  
  public reverse_history(id,page){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "niserv/history_fetch?id="+id+"&page="+page
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  public reverse_file_download(gen) {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue=url+"niserv/attechment_download?file_id="+gen
    return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
    )}

    public overall_download(formvalue){   
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url +"niserv/generate_overall_reportdownload?payment_type="+formvalue?.payment_type+"&transaction_type="+formvalue?.transaction_type+"&customer_type="+formvalue?.customer_type+"&from_date="+formvalue?.from_date+"&to_date="+formvalue?.to_date+"&code="+formvalue?.code+"&cbs_status="+formvalue?.cbs_status;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
      
    }

}
