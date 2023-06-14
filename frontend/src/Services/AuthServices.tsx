
export function googleLogin() {
	
	// Taken from here: https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
	const params = {
		"client_id": "350266424532-f4kveh8p006liu34u1nveof6f0krjmgk.apps.googleusercontent.com",
		"redirect_uri": import.meta.env.CLIENT_URL,
		"response_type": "token",
		"scope": "https://www.googleapis.com/auth/userinfo.profile",
		"include_granted_scopes": true,
		// "state": "pass-through value"
	};
// Google's OAuth 2.0 endpoint for requesting an access token
	const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

// Create <form> element to submit parameters to OAuth 2.0 endpoint.
	let form = document.createElement('form');
	form.setAttribute('method', 'GET'); // Send as a GET request.
	form.setAttribute('action', oauth2Endpoint);

// Add form parameters as hidden input values.
	for (let p in params) {
		let input = document.createElement('input');
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', p);
		input.setAttribute('value', params[p]);
		form.appendChild(input);
	}

// Add form to page and submit it to open the OAuth 2.0 endpoint.
	document.body.appendChild(form);
	form.submit();
}
