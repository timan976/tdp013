# -*- coding: utf-8 -*-

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

# Setup
driver = webdriver.Firefox()
driver.get("http://www-und.ida.liu.se/~timan976/tdp013/lab1/")
assert driver.title == "Sitter"

# Test requirements

# REQ: En användare skall kunna skriva in ett meddelande i ett fält, meddelandet får max ha 140 tecken.
# REQ: En användare skall kunna, genom att klicka på en knapp, publicera sitt meddelande. Innan meddelandet publiceras skall det valideras med JavaScript. 
#       Om meddelandet är tomt eller mer än 140 tecken skall det inte publiceras och ett felmeddelande skall visas för användare (obs, använd inte "alert" för felmeddelande).
textarea_elem = driver.find_element_by_css_selector("textarea[name=message]")

#  == The user shouldn't be able to post a message containing more than 140 characters ==
textarea_elem.send_keys("a"*146)
textarea_elem.send_keys(Keys.RETURN) # Post the message by pressing Enter

# Check the error message
flash_elem = driver.find_element_by_id("flash")
assert "error" in flash_elem.get_attribute("class")
assert flash_elem.text == "Your message contains more than 140 characters."
# Check the character count
count_elem = driver.find_element_by_css_selector(".character_count")
assert count_elem.text == "-6"

# Make sure the message wasn't posted
messages_elem = driver.find_element_by_id("messages")
messages = messages_elem.find_elements_by_class_name("message")
assert len(messages) == 0

# == The user can't post an empty message ==
textarea_elem.clear()
textarea_elem.send_keys(Keys.RETURN)

# Check the error message
assert "error" in flash_elem.get_attribute("class")
assert flash_elem.text == "Please enter a message."
# Make sure the message wasn't posted
messages_elem = driver.find_element_by_id("messages")
messages = messages_elem.find_elements_by_class_name("message")
assert len(messages) == 0

# == The user should be able to post a message with >0 and <=140 characters ==
textarea_elem.clear()
textarea_elem.send_keys("'Tis but a scratch!")
send_button_elem = driver.find_element_by_css_selector("input[name=send]")
send_button_elem.click() # Post the message by clicking the "Send" button

# Check the flash message
assert "success" in flash_elem.get_attribute("class")
assert flash_elem.text == "Message posted!"

# Make sure the message was actually posted
messages = messages_elem.find_elements_by_class_name("message")
test_message_elem = messages[0] # The first message on the page (REQ: Ett meddelande som är publicerat skall visas i kronologiskt fallande (senast först) ordning nedanför textfältet.)
assert "'Tis but a scratch!" in test_message_elem.text
assert "unread" in test_message_elem.get_attribute("class")

# Make sure "Click to mark as read..." works
# REQ: Alla meddelanden som visas skall ha en knapp som när man klickar markerar meddelandet som läst.
# REQ: Det skall vara tydlig skillnad mellan lästa och olästa meddelanden.
test_message_elem.click()
assert not "unread" in test_message_elem.get_attribute("class")

# REQ: Alla meddelanden skall försvinna när man laddar om sidan.
driver.refresh()
messages_elem = driver.find_element_by_id("messages")
messages = messages_elem.find_elements_by_class_name("message")
assert len(messages) == 0

print "All tests passed."

driver.close()
