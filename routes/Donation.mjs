import Donation from '../models/Donation';
import { default as router } from './main.mjs';

router.post('/addVideo', (req, res) => {
    let donationAmount = req.body.donationAmount;
    let donationMessage = req.body.donationMessage.slice(0,999);

    Donation.create({
        donationAmount,
        donationMessage
    }) .then((donation) => {
        res.redirect('/templates/index.html');
    })
    .catch(err => console.log(err))
})