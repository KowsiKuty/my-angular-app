import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {

  yesorno = [{ name: 'Yes', value: 'Y' }, { name: 'No', value: 'N' }]



  bcpboolean = true
  dueboolean = false


  questiondata = [
    {
      "ans_bool": "N",
      "id": 796,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 1,
      "question": "Is there a Board approved Business Continuity Plan? Does the BCM scope cover the entire operation, including all business processes and operations, as well as related facilities and workforce that are the responsibility of the company?",
      "remarks": ""
    },
    {
      "ans_bool": "N",
      "id": 797,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 2,
      "question": "Are there staffs assigned to undertake Business Continuity Management (BCM) with clearly defined and documented roles & responsibilities?",
      "remarks": ""
    },
    {
      "ans_bool": "N",
      "id": 798,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 3,
      "question": "Is there a business continuity strategy for; people, premises, technology, information, service providers and stakeholders?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 799,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 4,
      "question": "Has the risks to the operations, especially in the capacity of service provider to financial institutions for loan origination assessed and mitigated?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 800,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 5,
      "question": "Are the activities that are essential for delivery of the full range of products, services and works identified?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 801,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 6,
      "question": "When was the latest testing conducted and placed before the Management / Board? If so, please provide results of test performed or any “lessons learned”.",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 802,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 7,
      "question": "Whether risks/gaps were identified? How were the risks/gaps mitigated/addressed?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 803,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 8,
      "question": "Is there a proven and effective IT continuity plan? Is all critical data backed up and readily available offline and for remote access? Please describe how original loan documentation is stored and secured.",
      "remarks": ""
    },
    {
      "ans_bool": "N",
      "id": 804,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 9,
      "question": "Are copies of all vital documents and records readily available offsite? Please describe how copies of loan documentation and customer KYC documents are stored online/in electronic form, and whether backups are maintained.",
      "remarks": ""
    },
    {
      "ans_bool": "N",
      "id": 805,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 10,
      "question": "In case data is being stored or processed a third-party software, tech platform or operating system, does the BCP contemplate failure of such software?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 806,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 11,
      "question": "Is there a system to conduct customer due diligence (KYC verification, background checks, etc.) remotely?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 807,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 12,
      "question": "Are there business continuity processes for banking operations, loan disbursements and collections, and other crucial operations? Can these be handled remotely?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 808,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 13,
      "question": "Is there a method to communicate with key staff/stakeholders during a service disruption, during any given period?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 809,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 14,
      "question": "Is customer contact details database maintained that is accessible offline and remotely?",
      "remarks": ""
    },
    {
      "ans_bool": "N",
      "id": 810,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 15,
      "question": "Can disruption of operations and services be avoided when key locations are closed?",
      "remarks": ""
    },
    {
      "ans_bool": "Y",
      "id": 811,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 16,
      "question": "How can customers reach out to redress their grievances in case key offices/branches are closed? Has it been ensured that the customers are aware of how and whom to contact?",
      "remarks": ""
    },
    {
      "ans_bool": "N",
      "id": 812,
      "modify_status": 1,
      "old_ans_bool": "",
      "old_remarks": "",
      "ques_id": 17,
      "question": "How has the current Covid-19 pandemic affected the business, operations and services?",
      "remarks": ""
    }
  ]

  duedilligence = [
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 1,
      "question": "The following functions should not be part of the outsourcing arrangement:<br>(1) Core management functions including internal audit<br>(2) Strategic and compliance functions<br>(3) Decision-making functions such as determining compliance with KYC norms for opening deposit accounts<br>(4) According sanction for loans<br>(5) Management of investment portfolio",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 2,
      "question": "The following risks should be assessed: <br>(1)  Strategic risk<br>(2)  Reputation risk<br>(3)  Compliance risk<br>(4)  Operational risk<br>(5)  Legal risk<br>(6)  Exit strategy risk<br>(7)  Counter party risk<br>(8)  Contractual risk<br>(9)  Concentration and systemic risk<br>(10) Country risk",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 3,
      "question": "The internal control, business conduct or reputation of the company should not be compromised by the arrangement.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 4,
      "question": "Consider all relevant laws, regulations, guidelines and conditions of approval, licensing or registration.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 5,
      "question": "Ensure outsourcing arrangement will not  affect the right of a customer against the company, or the customer’s ability to obtain redress under the law.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 6,
      "question": "Service provider should be financially sound and have the resources and capabilities needed to perform outsourced work within timelines, and in adverse conditions.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 7,
      "question": "Service provider’s systems should be compatible with company requirements.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 8,
      "question": "Check service provider’s standards of performance including in customer service.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 9,
      "question": "Check market feedback of service provider’s business reputation, and track record of services rendered in the past.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 10,
      "question": "Avoid high level of concentration of outsourced arrangements with a single third party.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 11,
      "question": "Service provider should have strong safeguards to ensure there is no co-mingling of information, records and assets.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 12,
      "question": "Service provider should have safeguards for data security and confidentiality.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 13,
      "question": "Service provider should maintain appropriate IT security and disaster recovery capabilities.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 14,
      "question": "Service provider’s staff should have limited access to data only on a ‘need to know’ basis.",
      "remarks": ""
    },
    {
      "direction": "",
      "id": "",
      "modify_status": "",
      "old_direction": "",
      "old_remarks": "",
      "ques_id": 15,
      "question": "Service provider should have a framework for documenting, maintaining and testing business continuity and recovery procedures.",
      "remarks": ""
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  questionoptionselect(value, i) {
    this.questiondata[i].ans_bool = value
  }

  questionnairesubmit() {
    console.log('questiondata', this.questiondata)
  }

  questionnaireboolean(value) {
    this.bcpboolean = false
    this.dueboolean = false
    if (value == 'bcp') {
      this.bcpboolean = true
    }
    else {
      this.dueboolean = true
    }
  }

}
