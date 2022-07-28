import { LightningElement, track,api  } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/FileUploaderClass.uploadFile'



export default class CandidateRegistration extends LightningElement {
    @api recordId;
    fileData
    
    @track Candidate__c = {
        Name:'',
        Email__c:'',
        Phone__c:'',
        Password__c:''

    }
    
    @track InputFieldData=[
        {
            name:'Name',
            label:'Full Name',
            onchange:this.changeHandler,
            placeholder:'What is your name?',
            type:'text'
        },
        
        {
            name:'Email__c',
            label:'Email Id',
            onchange:this.changeHandler,
            placeholder:'Tell us your Email ID',
            type:'email'
        },
        {
            name:'Phone__c',
            label:'Mobile Number',
            onchange:this.changeHandler,
            placeholder:'Mobile number',
            type:'number'
        },
        {
            name:'Password__c',
            label:'Password',
            onchange:this.changeHandler,
            placeholder:'Create a password for your account',
            type:'password'
        }
    ]

    changeHandler(event){
        
        this.Candidate__c[event.target.name] = event.target.value;
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
 }
   

    CreateAccount(){

        const fields = this.Candidate__c
        const payload = { apiName : 'Candidate__c', fields};
       
        createRecord(payload).then(responsedgr => {
            
            
                const event = new ShowToastEvent({
                    title: 'Success!!',
                    message:'Now let\'s start building your profile & make it stronger'
                    //variant: 'success',
                });
                this.dispatchEvent(event)
               
            

        }).catch(error =>{
            const event = new ShowToastEvent({
                title: 'Error',
                message:'Error in creating account : '+ error.body.message
            });
            this.dispatchEvent(event)

        });
        

    }
    

    
}