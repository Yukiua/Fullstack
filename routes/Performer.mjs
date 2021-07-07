import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import Performer from '../models/Performer.js';
import User from '../models/User.js';
import { ensureAuthenticated } from '../config/authenticate.js';
import Hash from 'hash.js';
import { flashMessage } from '../utils/messenger.js';
import fs from 'fs';
import upload from '../utils/imageUpload.js'

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

import SettingsOptions from './PerformerSettings.mjs'
router.use("/settings", SettingsOptions)

router.get("/dashboard", ensureAuthenticated, dashboard_page);
router.get("/analytics", ensureAuthenticated, analytics_page);
router.get("/settings",ensureAuthenticated, settings_page);
router.get("/logout", logout_page);
router.get("/createLivestream", ensureAuthenticated, createLive_page);

async function dashboard_page(req, res) {
	console.log("Performer Dashboard accessed");
	let email = req.cookies['performer']
	const performer = await Performer.findOne({
		where: { email: email }
	})
	return res.render('performer/dashboard.html', {
		name: performer.name
	})
};

async function analytics_page(req, res) {
	console.log("Performer Analytics accessed");
	let email = req.cookies['performer']
	const performer = await Performer.findOne({
		where: { email: email }
	})
	return res.render('performer/analytics.html', {
		name: performer.name,
		author: "The awesome programmer",
		// donations
		values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		// total watch views
		secondvalues: [1921, 1982, 1934, 1954, 1025, 1205, 1680, 1666, 1689, 1999, 1578, 1255],
		// total watch per hour
		thirdvalues: [105, 163, 176, 126, 159, 158, 162, 199, 103, 103, 108, 104]
	});
};

async function settings_page(req,res){
	console.log("Performer Settings accessed");
	let email = req.cookies['performer']
	const performer = await Performer.findOne({
		where: { email: email }
	})
	return res.render('performer/settings.html', {
		name: performer.name
	})
};

async function logout_page(req, res) {
	console.log("Performer Logout accessed");
	req.logout();
	req.flash('success_msg', 'You are logged out from performer')
	return res.redirect('/')
};

async function createLive_page(req, res) {
	console.log("Create Livestream accessed, passing over");
	return res.redirect('../createLivestream')
};