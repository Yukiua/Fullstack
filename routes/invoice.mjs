import easyinvoice from 'easyinvoice';
import fs from 'fs';

const elementId = 'pdf';

const result = await easyinvoice.createInvoice(data);
easyinvoice.render(elementId, result.pdf);

var data = {

    "currency": "SGD",//See documentation 'Locales and Currency' for more inf
    "taxNotation": "vat", //or gst
    "marginTop": 25,
    "marginRight": 25,
    "marginLeft": 25,
    "marginBottom": 25,
    "logo": "iVBORw0KGgoAAAANSUhEUgAAAScAAAEfCAYAAAADcwCBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAeUSURBVHhe7dzBa5QHHsZx/6g97Wn/ghwD4k3IQbYQeihe0kuDBylICiU9rO5BWahbWF2oCItdRISGgEIkUCms5JJAIQuSgDAg/Hby65jEZMxGdyc+Uz4feBCd953oYb6875jMuQIIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIJE5AJHECIokTEEmcgEjiBEQSJyCSOAGRxAmIdO53v/9DmUEacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60EacbIepBEn60GaM4jTcq3ujr7aqezW6lfjnme42cW68XC9Nl8OavB6dPie18Pfv9yqZw9v1eLFMed9vzE68APsPq2ldzzXi+8P/fk7N1eLNx/Vs63dGgxGJ44MXu3W5tqjunFlbsx5ZztIMzVxuvCnldo88uIeb1CbP16vC4fP/0hxmvnyQb045b99sLVSy+PCekaDNGcbp6Mv9NPuq6e1M3qKjs/ag7pxbbHm917MFy/XwrVbdffHn2t7P16DevG3P45/rsM7/Lwb98Yfc3SnjNPM14f/zlU7G0/r/s2lWvhs7ypprua/WKzl71bq+cFfujb/8emx5zmrQZopiNP5urvfg+FV1dfnxxzzZnN19eHW8BbvlF9nUnGav1cv9puzW8/+cnn8caP1VeH201oe89hZDdJMQZxu1/M37y9tr9TC2GPe3szsSQE7tAnFaXnt0NXQDyeHKWWQZgriNLwKGZ1eW4/q0thjPnCTiNPsnYOYvlr/qFdD7zNIMwVxWqrVl6Pzh7dIz79drJmxx33AJhGnP6/Xm+umwfqt44+HDtJMxRvi88MgHNwoDV/02xu1ev9WLX5yytu3d20Ccbr0w9bo0b1buo/3Bvf7DtKcbZxOY2wkztfV4Yv+cKD2vR7UztZ6Pf7u+q//e3fs3BM2gTgtPTn4x77rPanEQZopidNoF5fq7pON2j7h+Xb+9aCunjZS4rQ/SDMVt3Vjd/FyXb15rx6vjYnVYKPuzo855+jc1u0P0kxvnI7swpU7tfrLwY3fYO362OPe2oTfEK+fbx9/PHSQ5jcTp97sg9ocfalTfU/UJOJ0+PuyXq3XjWOPZw7S/Lbi9L7fEzWROPkmTPh/mII4na9bP+3W5pPbtTA77vGDzd8/eL/no93W7e19f3zl2iM/vgJH5Mfpykptj06v13sfMbJSf/1msRa+uNyfPDDzyee18M2devzTvw/e69l7Q/yzMc91dJOK03B+8Bf+N2cbp1M5+pEpc3X1/kbtHP78ppMMtuqfX37cn617Mx+ZAh9uCuI02uyntTS80ugPbXt1cLXRBoPa+WWjVv++XJf+y63fW5twnH6dD5uDD3EGcbJpGKQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBGnGyHqQRJ+tBmnOjXwGiiBMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECYgkTkAkcQIiiRMQSZyASOIERBInIJI4AZHECQhU9R+PUKmiOz2MEgAAAABJRU5ErkJggg==", //or base64
    "background": "", //or base64 //img or pdf
    "sender": {
        "company": "ESTIC",
        "address": "Orchard Road 123",
        "zip": "123456",
        "city": "Singapore",
        "country": "Singapore"
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
    },
    "client": {
       	"company": "",
       	"address": "Ang Mo Kio 456",
       	"zip": "4567 CD",
       	"city": "Singapore",
       	"country": "Singapore"
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
    },
    "invoiceNumber": "123",
    "invoiceDate": "1.1.2021",
    "products": [
        {
            "quantity": "1",
            "description": "Donation to Joshua",
            "tax": 0,
            "price": 50.00
        },
    ],
    "bottomNotice": "Thank you for your donation!",
};

easyinvoice.createInvoice(data, async function (result) {
    console.log(result.pdf);

    await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
});

//easyinvoice.download('myInvoice.pdf', result.pdf);