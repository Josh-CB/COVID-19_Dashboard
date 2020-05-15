module.exports.convert = function(id) {
    const lookup = {'Antigua_and_Barbuda': 'Antigua and Barbuda','Bosnia_and_Herzegovina': 'Bosnia and Herzegovina','British_Virgin_Islands': 'British Virgin Islands',
        'Brunei_Darussalam': 'Brunei Darussalam','Burkina_Faso': 'Burkina Faso','Cape_Verde': 'Cape Verde','Cayman_Islands': 'Cayman Islands',
        'Central_African_Republic': 'Central African Republic','Costa_Rica': 'Costa Rica','Cote_dIvoire': 'Cote d\'Ivoire',
        'Democratic_Republic_of_the_Congo': 'Democratic Republic of the Congo','Dominican_Republic': 'Dominican Republic','El_Salvador': 'El Salvador',
        'Equatorial_Guinea': 'Equatorial Guinea','Falkland_Islands_(Malvinas)': 'Falkland Islands','Faroe_Islands': 'Faroe Islands',
        'French_Polynesia': 'French Polynesia','Guinea_Bissau': 'Guinea Bissau','Holy_See': 'Holy See','Isle_of_Man': 'Isle of Man',
        'New_Caledonia': 'New Caledonia','New_Zealand': 'New Zealand','North_Macedonia': 'North Macedonia','Northern_Mariana_Islands': 'Northern Mariana Islands',
        'Papua_New_Guinea': 'Papua New Guinea','Puerto_Rico': 'Puerto Rico','Saint_Kitts_and_Nevis': 'Saint Kitts and Nevis','Saint_Lucia':'Saint Lucia',
        'Saint_Vincent_and_the_Grenadines':'Saint Vincent and the Grenadines','San_Marino':'San Marino','Sao_Tome_and_Principe':'Sao Tome and Principe',
        'Saudi_Arabia':'Saudi Arabia','Sierra_Leone':'Sierra Leone','Sint_Maarten':'Sint Maarten','South_Africa':'South Africa','South_Korea':'South Korea',
        'South_Sudan':'South Sudan','Sri_Lanka':'Sri Lanka','Timor_Leste':'Timor Leste','Trinidad_and_Tobago':'Trinidad and Tobago',
        'Turks_and_Caicos_islands':'Turks and Caicos islands','United_Arab_Emirates':'United Arab Emirates','United_Kingdom':'United Kingdom',
        'United_Republic_of_Tanzania':'United Republic of Tanzania','United_States_of_America':'United States of America','United_States_Virgin_Islands':'United States Virgin Islands',
        'Western_Sahara':'Western Sahara'
    }
    if(id in lookup) {
        const name = lookup[id];
        return name
    }
    else {
        return id
    }
    
}