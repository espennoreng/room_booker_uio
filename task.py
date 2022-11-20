import math

def product_of_highest_3(list_of_ints: list) -> int:
    '''
    Returns the product of the three biggest values in a integer list
    '''
    l = list_of_ints
    l.sort(reverse = True)
    return math.prod(l[:3])
    # -10, -5, 1, 2, 3
    
list_of_ints = [1, 10,2,6,5,3]
print(product_of_highest_3(list_of_ints))