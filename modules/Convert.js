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

module.exports.convertNameToID = function(name) {
    const lookup = {
        'Antigua and Barbuda': 'Antigua_and_Barbuda',
        'Bosnia and Herzegovina': 'Bosnia_and_Herzegovina',
        'British Virgin Islands': 'British_Virgin_Islands',
        'Brunei Darussalam': 'Brunei_Darussalam',
        'Burkina Faso': 'Burkina_Faso',
        'Cape Verde': 'Cape_Verde',
        'Cayman Islands': 'Cayman_Islands',
        'Central African Republic': 'Central_African_Republic',
        'Costa Rica': 'Costa_Rica',
        "Cote d'Ivoire": 'Cote_dIvoire',
        'Democratic Republic of the Congo': 'Democratic_Republic_of_the_Congo',
        'Dominican Republic': 'Dominican_Republic',
        'El Salvador': 'El_Salvador',
        'Equatorial Guinea': 'Equatorial_Guinea',
        'Falkland Islands': 'Falkland_Islands_(Malvinas)',
        'Faroe Islands': 'Faroe_Islands',
        'French Polynesia': 'French_Polynesia',
        'Guinea Bissau': 'Guinea_Bissau',
        'Holy See': 'Holy_See',
        'Isle of Man': 'Isle_of_Man',
        'New Caledonia': 'New_Caledonia',
        'New Zealand': 'New_Zealand',
        'North Macedonia': 'North_Macedonia',
        'Northern Mariana Islands': 'Northern_Mariana_Islands',
        'Papua New Guinea': 'Papua_New_Guinea',
        'Puerto Rico': 'Puerto_Rico',
        'Saint Kitts and Nevis': 'Saint_Kitts_and_Nevis',
        'Saint Lucia': 'Saint_Lucia',
        'Saint Vincent and the Grenadines': 'Saint_Vincent_and_the_Grenadines',
        'San Marino': 'San_Marino',
        'Sao Tome and Principe': 'Sao_Tome_and_Principe',
        'Saudi Arabia': 'Saudi_Arabia',
        'Sierra Leone': 'Sierra_Leone',
        'Sint Maarten': 'Sint_Maarten',
        'South Africa': 'South_Africa',
        'South Korea': 'South_Korea',
        'South Sudan': 'South_Sudan',
        'Sri Lanka': 'Sri_Lanka',
        'Timor Leste': 'Timor_Leste',
        'Trinidad and Tobago': 'Trinidad_and_Tobago',
        'Turks and Caicos islands': 'Turks_and_Caicos_islands',
        'United Arab Emirates': 'United_Arab_Emirates',
        'United Kingdom': 'United_Kingdom',
        'United Republic of Tanzania': 'United_Republic_of_Tanzania',
        'United States of America': 'United_States_of_America',
        'United States Virgin Islands': 'United_States_Virgin_Islands',
        'Western Sahara': 'Western_Sahara'
      }
    
    if(name in lookup) {
        const id = lookup[name];
        return id
    }
    else {
        return name
    }
}
