import React, { Component } from 'react';
const styles = {
    autoStyle1: {
        fontSize: 'large'
    },
    autoStyle2: {
        textAlign: 'center'
    },
    autoStyle3: {
        paddingLeft: '2em',
        paddingRight: '2em'
    },
    faqQuestion: {
        paddingLeft: '2em',
        paddingRight: '2em',
        fontWeight: 'bold'
    },
    faqAnswer: {
        paddingLeft: '4em',
        paddingRight: '2em',
        marginBottom: '1em'
    },
    highlightHeader: {
        paddingLeft: '4px',
        background: '#e0e0e0',
        fontSize: '1.17em',
        fontWeight: 'bold',
        marginTop: '1em',
        marginBottom: '1em'
    }
}
class About extends Component {
    render() {
        return (
            <div style={{ marginLeft: '30px', marginRight: '30px', marginTop: '0.5em' }}>
                <base target="_blank" />
                <div style={styles.highlightHeader}>
                    CrewTimer Architecture
</div>
                <div style={styles.autoStyle3}>
                    <p style={styles.autoStyle2}>
                        <img alt="CrewTimer Architecture" height="342" src="images/CrewTimerArchitecture2.png" width="437" /></p>
                    CrewTimer utilizes affordable android tablets for recording start and
	finish times at the press of a button on screen or by pressing a button that
	plugs into the audio jack on the tablets.&nbsp; It works equally well with
	phones.&nbsp; Timing is based on the precise GPS timing provided by GPS and cellular networks
	so time synchronization of tablets is inherently part of the architecure.&nbsp; Time events are
	instantly communicated
	to the CrewTimer server built on the Google Cloud Platform to provide scalability and capacity to many simultaneous users.&nbsp;
	Results are available from a web browser and can also be tweeted to your own
	twitter feed.</div>
                <div style={styles.highlightHeader}>
                    Getting Started
</div>
                <table style={styles.autoStyle3}>
                    <tbody>
                        <tr>
                            <td style={styles.autoStyle1}><strong>Register</strong></td>
                            <td>The first step is to register on
		&nbsp;<a href="https://admin.crewtimer.com" target="_parent">admin.crewtimer.com</a>&nbsp;
                                for admin access to your regatta.&nbsp; Once you have registered you will
		have access to configuration pages within the CrewTimer website via a '<em>My
		Regattas</em>' link.</td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}><strong>Create your regatta spreadsheet</strong></td>
                            <td>Regattas are configured with either Excel or Google Sheets.&nbsp; Google
		Sheets is preferred as there is support for updating your regatta in real
		time with changes to your Google Sheet.&nbsp; Example Google Sheets are
		available for
		&nbsp;<a rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/1K2UWYS9Vfb4HlHtMGRi5pGRWj4CM9ZrKNbWo58vdvh4/edit?usp=sharing">Head Races</a> as well as
		&nbsp;<a rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/1rKtt6x9Cw_Dwnbhej7rvyqP14bDF4myI3sMBmlYZMSQ/edit?usp=sharing" target="_blank">Sprint Races</a>.<br />
                                <br />
                                Just click on one of the links above and select <em>'File' -&gt; 'Make a Copy'</em>
                                to get started with your regatta.&nbsp; </td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}><strong>Connect your spreadsheet to CrewTimer</strong></td>
                            <td>To connect your Google Sheet to CrewTimer, a share link is copied from
		your spreadsheet and pasted into your regatta configuration on
		&nbsp;<a href="http://admin.crewtimer.com" target="_parent">admin.crewtimer.com</a>.&nbsp;
		For details on how to share your regatta spreadsheet with CrewTimer
		follow the instructions provided to you when you register.&nbsp; </td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}><strong>Configure your mobile devices</strong></td>
                            <td>The CrewTimer mobile app is available in the Google Play store and is
		compatible with virtually all phones and tablets.&nbsp; Inexpensive 7" tablets
		make excellent devices to use for recording Start and Finish events.  After you register, you
		will receive additional details instructing you how to link the app to the online website.</td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td style={styles.autoStyle1}><strong>View Results</strong></td>
                            <td>Regatta results are immediately available on the CrewTimer website as
		the races progress.&nbsp; If twitter integration is enabled, your
		regatta results are also tweeted to your twitter feed.</td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.highlightHeader}>FAQ</div>
                <div>
                    <div style={styles.faqQuestion}>
                        How much does CrewTimer cost?</div>
                    <div style={styles.faqAnswer}>
                        CrewTimer is free.&nbsp;&nbsp; The author of CrewTimer is a professional
		developer and created CrewTimer to help his local club do regatta timing
		for Junior events.&nbsp; He has since 'caught the bug' from his kids and is a
		masters rower.&nbsp; It is hoped that other clubs find CrewTimer useful and
		beneficial for the benefit of the sport.</div>
                    <div style={styles.faqQuestion}>
                        Does CrewTimer require any special equipment?</div>
                    <div style={styles.faqAnswer}>
                        The only requirement is an Android tablet or phone that has an internet
		connection.&nbsp; A WiFi only tablet can work just fine when tethered to
		a phone or connected to a facility WiFi.&nbsp; When using WiFi a private
		WiFi is recommended to insure access.&nbsp; 7" android tablets can be
		obtained for as little as $50.&nbsp; T-mobile provides a 200MB free plan
		if you bring your own tablet.&nbsp; A typical regatta will use less than
		5MB of data.</div>
                    <div style={styles.faqQuestion}>
                        How can I install the App?</div>
                    <div style={styles.faqAnswer}>
                        The CrewTimer app is available on the
		&nbsp;<a href="https://play.google.com/store/apps/details?id=net.entazza.crewtimer">Google Play Store</a>.&nbsp;
		Search for CrewTimer.</div>

                    <div style={styles.faqQuestion}>
                        Does CrewTimer support iOS devices like iPad or iPhone?</div>
                    <div style={styles.faqAnswer}>
                        Both iOS and Android are supported for viewing results and configuring regattas.  The mobile timing app is currently only available for Android.&nbsp; An iOS app for timing events is under development.</div>
                    <div style={styles.faqQuestion}>
                        How do I configure CrewTimer?</div>
                    <div style={styles.faqAnswer}>
                        Regattas are configured with either Excel or Google Sheets.&nbsp; Google
		Sheets is preferred as there is support for updating your regatta in real
		time with changes to your Google Sheet.&nbsp; Example Google Sheets are
		available for
		&nbsp;<a rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/1K2UWYS9Vfb4HlHtMGRi5pGRWj4CM9ZrKNbWo58vdvh4/edit?usp=sharing" target="_blank">Head Races</a> as well as
		&nbsp;<a rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/1rKtt6x9Cw_Dwnbhej7rvyqP14bDF4myI3sMBmlYZMSQ/edit?usp=sharing" target="_blank">Sprint Races</a>.<br />
                        <br />
                        Just click on one of the links above and select 'File' -&gt; 'Make a Copy'
		to get started with your regatta.&nbsp; You might find the template
		useful even if you continue to use manual recording of times.</div>
                    <div style={styles.faqQuestion}>
                        How accurate is CrewTimer?</div>
                    <div style={styles.faqAnswer}>
                        CrewTimer utilizes the time of the mobile devices which is in turn synchronized with GPS satellites.  Event times are recorded to 0.001 second resolution.  The accuracy is determined by
		human response times to start and finish events.&nbsp; In addition, an
		external button can be used (aka pickle switch) to record times by
		plugging it into the audio jack of the mobile device.&nbsp; Bluetooth
		switches are in an experimental phase.</div>
                    <div style={styles.faqQuestion}>
                        Can I export a PDF of my regatta results?</div>
                    <div style={styles.faqAnswer}>
                        Yes, just click on the print icon.&nbsp; If you use Google Chrome you
		can select Print as PDF.</div>
                    <div style={styles.faqQuestion}>
                        What happens if I make a mistake recording a time event?</div>
                    <div style={styles.faqAnswer}>
                        The CrewTimer mobile application has a variety of means for correcting
		mistakes as this is bound to happen.&nbsp; Individual time events can be
		modified on the mobile device to account for a variety of situations.</div>
                    <div style={styles.faqQuestion}>
                        Can I change regatta entries during a regatta?</div>
                    <div style={styles.faqAnswer}>
                        Yes, you can add or remove entries during a regatta to reflect last
		minute additions or withdrawals.&nbsp; For events that have times
		recorded, the Time, Flight #, Event #, and Bow# are permanently bound together.&nbsp; CrewTimer also provides other
		mechanisms for tweaking results if absolutely necessary.</div>
                    <div style={styles.faqQuestion}>
                        How does CrewTimer handle handicaps for masters races?</div>
                    <div style={styles.faqAnswer}>
                        CrewTimer uses the handicap tables and formulas defined in <em>USRowing
		Rules of Rowing</em>.&nbsp; Manual handicaps can also be specified.</div>
                    <div style={styles.faqQuestion}>
                        Can a referee assess a penalty?</div>
                    <div style={styles.faqAnswer}>
                        Yes, by pressing and holding a bow number on the mobile device,
		penalties can be assessed for that bow number using both referee defined
		values as well as 'standard' values listed in <em>Rules of Rowing</em>.</div>
                    <div style={styles.faqQuestion}>
                        What technologies are used in CrewTimer?</div>
                    <div style={styles.faqAnswer}>
                        CrewTimer utilizes an Android application written in Java in conjuction
		with a Google Cloud Platform back end utilizing React with node.js and Google's real time database.</div>
                    <div style={styles.faqQuestion}>
                        Can I make my regatta results private?</div>
                    <div style={styles.faqAnswer}>
                        Yes, you can use CrewTimer to do timing for your regatta or scrimmage and hide the
		results from the public <a href="http://www.crewtimer.com" target="_parent">www.crewtimer.com</a>
                        &nbsp;website.&nbsp; All the features are still available such as printing
		results and configuration of your regatta entries.&nbsp; Results are
		private by default.</div>
                    <div style={styles.faqQuestion}>
                        Can CrewTimer be used for other sports?</div>
                    <div style={styles.faqAnswer}>
                        Yes, any event that has similar timing needs to head or sprint races can&nbsp;
		use CrewTimer.</div>

                    <div style={styles.faqQuestion}>
                        Who do I contact for support or if I have more questions?</div>
                    <div style={styles.faqAnswer}>
                        You can contact
		&nbsp;<a href="mailto:info@crewtimer.com?subject=CrewTimer Question">info@crewtimer.com</a> with questions.&nbsp; If you have questions
		during a regatta a cell-phone number is provided to you for quick
		response.</div>
                </div>
                <div style={styles.highlightHeader}>Notice</div>
                <div>
                Copyright Entazza LLC. All rights reserved. Not liable for any damage incurred from 
use of this software including but not limited to: monetary loss, 
temporary paralysis, halitosis, spontaneous combustion, 
random crabs, broken skegs, and or premature oar loss.  No animals were injured 
during development and testing of this app.
</div>
            </div>
        );
    }
}

export default About;