import firebase from 'firebase/app';
import * as Names from './Names';
const ALPHA_CHARSET = "abcehjknoprstvxyz";
class Util {
	static createRegattaId() {
		var id = '';
		for (let i = 0; i < 8; i++) {
			const r = Math.random() * 32767 % ALPHA_CHARSET.length;
			id = id + ALPHA_CHARSET.substr(r, 1);
			// if (i===3) id = id + '.';
		}
		// TODO: do gen-id while (id not already used)
		return id;
	}
	static setUser(user) {
		if (user) {
			Util.user = user;
			Util.userSignedIn = true;
		} else {
			Util.user = null;
			Util.userSignedIn = false
		}
	}

	// Return a promise with the regatta configuration.
	// Util.getRegattaConfig('ashtxatj').then(function(regattaConfig){
	//     console.log(JSON.stringify(regattaConfig));
	//   });
	static getRegattaConfig(name) {
		name = name.replace('.', '');
		return firebase.database().ref('regatta/' + name + "/settings/config").once('value')
			.then(function (snapshot) {
				const result = snapshot.val();
				if (!result) return Promise.reject("Regatta not found");
				return Promise.resolve(result);
			}).catch((reason) => {
				console.log("Read regatta error: ", reason);
				return Promise.reject(reason);
			});
	}

	// Return a firebase ref with raw lap data
	static getLapData(regatta, eventId, lapItem) {
		regatta = regatta.replace('.', '');
		let ref = firebase.database().ref('regatta/' + regatta + '/lapdata');
		ref.orderByChild('EventId').equalTo(eventId).on("child_added", (snapshot) => {
				const result = snapshot.val();
				// console.log("lap:",JSON.stringify(result));
				if (lapItem) {
					lapItem(result);
				}
			});
		return ref;
	}

	// Return a promise to set the regatta configuration
	// Util.setRegattaConfig('ashtxatj',regattaConfig).then(function(){
	// 	console.log("regatta stored");
	//   });
	static setRegattaConfig(name, props) {
		name = name.replace('.', '');
		return firebase.database().ref('regatta/' + name + "/settings/config").update(props);
	}

	static storeLap(regatta, lap) {
		firebase.database().ref('/regatta/'+regatta+'/lapdata/'+lap[Names.N_UUID]).update(lap);
	}

	// Return a promise to delete the regatta
	static deleteRegatta(regatta) {
		regatta = regatta.replace('.', '');
		let updates = {};
		// console.log("info="+JSON.stringify(results.regattaInfo));
		updates['/regatta/' + regatta] = null;
		updates['/results/' + regatta] = null;
		updates['/summary/' + regatta] = null;
		return firebase.database().ref().update(updates).then(function () {
			console.log("Regatta deleted: ", regatta);
			return Promise.resolve({});
		}).catch((reason) => {
			console.log("Delete regatta error: ", reason);
			return Promise.reject(reason);
		});
	}

	// Return a promise to clear the lap data
	static clearLapData(regatta) {
		regatta = regatta.replace('.', '');
		var updates = {};
		// console.log("info="+JSON.stringify(results.regattaInfo));
		updates['/regatta/' + regatta + '/lapdata'] = null;
		updates['/regatta/' + regatta + '/settings/config/ClearTS'] = firebase.database.ServerValue.TIMESTAMP;
		return firebase.database().ref().update(updates).then(function () {
			console.log("Regatta reset: ", regatta);
			return Promise.resolve({});
		}).catch((reason) => {
			console.log("Clear Lap Data error: ", reason);
			return Promise.reject(reason);
		});
	}

	static containsKey(map, key) {
		return !(typeof map[key] === 'undefined') || map[key] === null;
	}

	static regattaAdmins = {};
	static refreshRegattaAdmins() {
		firebase.database().ref('groups/admins').once('value')
			.then(function (snapshot) {
				const result = snapshot.val();
				if (result) Util.regattaAdmins = result;
			}).catch((reason) => {
			});
	}

	static onRegattaResultsChange(regatta, onChange) {
		regatta = regatta.replace('.', '');
		let ref = firebase.database().ref('regatta/'+regatta+'/lapdata');
		ref.on('value', snapshot => {
			let list = snapshot.val();
			onChange(regatta, list);
		});
		return ref;
	}

	static offRegattaResultsChange(ref) {
		ref.off();
	}

	// Register interest in changes to the summary regatta configuration
	static onRegattaSummaryChange(onChange) {
		let regattaListRef = firebase.database().ref('summary');
		regattaListRef.on('value', snapshot => {
			let summary = snapshot.val();
			let email = Util.user.email;

			firebase.database().ref('groups/admins').once('value')
				.then(function (snapshot) {
					const result = snapshot.val();
					if (result) Util.regattaAdmins = result;
					// Limit list to those the user has access to
					let allowed = [];
					Object.keys(summary).forEach((id) => {
						let regatta = summary[id];
						if ((Util.containsKey(Util.regattaAdmins, Util.user.uid) && Util.regattaAdmins[Util.user.uid]) ||
							(regatta[Names.N_OWNER].indexOf(email) >= 0) ||
							(Util.containsKey(regatta, Names.N_ADMINS) && regatta[Names.N_ADMINS].indexOf(email) >= 0)) allowed.push(regatta);
					});
					/* Update React state when results change */
					onChange(allowed);
				}).catch((reason) => {
					console.log("Unable to read admin groups: ", reason);
				});
		});
		return regattaListRef;
	}

	static doLogout() {
		firebase.auth().signOut().then(function () {
			console.log('Signed out');
			// Sign-out successful.
		}).catch(function (error) {
			console.log("Error logging out: ", error);
			// An error happened.
		});
	}

	static isUserSignedIn() {
		return Util.userSignedIn === true;
	}

	static isUserRegistered() {
		return Util.user != null && Util.user.isRegistered;
	}

	static getUser() {
		return Util.user;
	}

	static test() {
		Util.getRegattaConfig('ashtxatj').then(function (regattaConfig) {
			console.log('regatta read OK: ', JSON.stringify(regattaConfig));
			regattaConfig.xyz = "abc";
			Util.setRegattaConfig('ashtxatj', regattaConfig).then(function () {
				console.log("regatta stored");
			}).catch((reason) => { console.log("Regatta update failed:", reason) });
		}).catch((reason) => {
			console.log('regatta read fail: ', reason);
			return Promise.reject(reason);
		});
	}

	static delayedPromise(ms, work, ontimeout) {
		return new Promise(function (resolve, reject) {
			// Set up the real work
			work(resolve, reject);

			// Set up the timeout
			setTimeout(function () {
				if (ontimeout) ontimeout();
				reject('Promise timed out after ' + ms + ' ms');
			}, ms);
		});
	}

	// Return a promise to refresh the regatta csv spreadsheet
	static reloadCsv(regatta, url='') {
		regatta = regatta.replace('.', '');
		let ref = firebase.database().ref('actions/' + regatta + "/reloadcsv");
		let refUpdated = ref.child('updated');
		let result = Util.delayedPromise(20000, (resolve, reject) => {
			// read 'updated' value and wait for it to change
			refUpdated.once('value')
				.then(function (snapshot) {
					let val = snapshot.val();
					if (!val) val = {};
					ref.update({ request: {url: url, date: new Date().toISOString() }})
						.then(() => {
							refUpdated.on("value", function (snapshot, prevChildKey) {
								//console.log("csv update complete: ", snapshot.val(), " ", val, " ", prevChildKey);
								let update = snapshot.val();
								if (update && val && val['date'] !== update['date']) {
									snapshot.ref.off();
									resolve(update);
								}
							});
						}).catch((reason) => {
							console.log('reload csv fail: ', reason);
							refUpdated.off();
							reject(reason);
						});
				});
		}, () => { refUpdated.off() });

		return result;
	}

	static authCallbackList = [];
	static _invokeAuthCallbacks() {
		for (let i = 0; i < Util.authCallbackList.length; i++) {
			Util.authCallbackList[i](Util.user);
		}
	}

	static onAuthStateChange(onChange) {
		Util.initializeAppUtilities();
		Util.authCallbackList.push(onChange);
	}

	// Return a promise to update the user registration
	static registerUser(props) {
		if (!Util.user) return false;
		console.log("Registering user " + Util.user.email);
		props = Object.assign({}, props);
		props.uid = Util.user.uid;
		props.email = Util.user.email;
		props.displayName = Util.user.displayName;
		props.photoURL = Util.user.photoURL;
		//		firebase.database().ref('groups/admins').update({ x: true });
		return firebase.database().ref('users/' + Util.user.uid).update(props).then()
			.then((val) => {
				Util.user.isRegistered = Util.isRegistered = true;
				Util._invokeAuthCallbacks();
				return Promise.resolve(val);
			})
			.catch((reason) => { return Promise.reject(reason) });
	}

	static isAuthInitialized() {
		return Util.authInitialized;
	}

	static initializeAppUtilities() {
		if (Util.initialized) return;
		Util.authInitialized = false;
		Util.initialized = true;
		firebase.auth().onAuthStateChanged(user => {
			Util.authInitialized = true;
			Util.setUser(user);
			if (user) {
				return firebase.database().ref('users/' + Util.user.uid).once('value')
					.then(function (snapshot) {
						const profile = snapshot.val();
						Util.isRegistered = (profile != null);
						user.isRegistered = Util.isRegistered;
						Util._invokeAuthCallbacks();
					})
					.catch((reason) => {
						Util._invokeAuthCallbacks();
					});
			} else {
				Util.isRegistered = false;
				Util._invokeAuthCallbacks();
			}
		});
	}

	static getResultWaypoints(regattaConfig) {
		let waypoints = regattaConfig[Names.N_RESULT_WAYPOINTS];
		if (!waypoints || waypoints === "") waypoints = regattaConfig[Names.N_WAYPOINTS];
		if (!waypoints) waypoints="";
		if (waypoints.length===0) {
		  waypoints=[];
		}
		else  {
		  waypoints = waypoints.split(',');
		}
		return waypoints;
	}

	static getTimingWaypoints(regattaConfig) {
		let waypoints = regattaConfig[Names.N_WAYPOINTS];
		if (!waypoints) waypoints="";
		if (waypoints.length===0) {
		  waypoints=[];
		}
		else  {
		  waypoints = waypoints.split(',');
		  waypoints = waypoints.map(waypoint => waypoint.trim());
		}
		return waypoints;
	}
};

export default Util;